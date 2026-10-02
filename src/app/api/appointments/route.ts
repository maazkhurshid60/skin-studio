import { NextRequest, NextResponse } from "next/server";
import { getDb, queryOne, queryAll, persist } from "@/lib/db";

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function POST(request: NextRequest) {
  const db = await getDb();

  let body: {
    serviceId: number;
    providerId: number;
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { serviceId, providerId, date, time, customerName, customerEmail, customerPhone, notes } = body;

  // Validate required fields
  if (!serviceId || !providerId || !date || !time || !customerName || !customerEmail || !customerPhone) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Validate phone
  const cleanPhone = customerPhone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Validate time format
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Invalid time format" }, { status: 400 });
  }

  // Get service
  const service = queryOne<{ id: number; duration_minutes: number; name: string }>(
    db,
    "SELECT id, duration_minutes, name FROM services WHERE id = ? AND active = 1",
    [serviceId],
  );
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Verify provider exists and is eligible
  const provider = queryOne<{ id: number; name: string }>(
    db,
    `SELECT p.id, p.name FROM providers p
     JOIN provider_services ps ON ps.provider_id = p.id
     WHERE p.id = ? AND ps.service_id = ? AND p.active = 1`,
    [providerId, serviceId],
  );
  if (!provider) {
    return NextResponse.json({ error: "Provider not available for this service" }, { status: 400 });
  }

  const startMinutes = toMinutes(time);
  const endMinutes = startMinutes + service.duration_minutes;
  const endTime = fromMinutes(endMinutes);

  // Server-side double-booking prevention
  const conflicts = queryAll(
    db,
    `SELECT id FROM appointments
     WHERE provider_id = ? AND date = ? AND status IN ('pending', 'confirmed')
     AND (
       (? < end_time AND ? > start_time)
     )`,
    [providerId, date, time, endTime],
  );

  if (conflicts.length > 0) {
    return NextResponse.json(
      { error: "This time slot is no longer available. Please choose another time." },
      { status: 409 },
    );
  }

  // Insert appointment
  db.run(
    `INSERT INTO appointments (service_id, provider_id, customer_name, customer_email, customer_phone, date, start_time, end_time, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [serviceId, providerId, customerName.trim(), customerEmail.trim().toLowerCase(), cleanPhone, date, time, endTime, notes?.trim() || null],
  );

  const appointmentId = db.exec("SELECT last_insert_rowid()")[0]!.values[0]![0] as number;
  persist(db);

  return NextResponse.json({
    id: appointmentId,
    status: "pending",
    message: "Your appointment request has been received and is pending confirmation. We will contact you shortly.",
    service: service.name,
    provider: provider.name,
    date,
    time,
    endTime,
  }, { status: 201 });
}
