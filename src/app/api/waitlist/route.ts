import { NextRequest, NextResponse } from "next/server";
import { getDb, queryOne, persist } from "@/lib/db";

export async function POST(request: NextRequest) {
  const db = await getDb();

  let body: {
    serviceId: number;
    providerId?: number | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    preferredDateStart: string;
    preferredDateEnd: string;
    preferredTimeStart?: string;
    preferredTimeEnd?: string;
    notes?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    serviceId,
    providerId,
    customerName,
    customerEmail,
    customerPhone,
    preferredDateStart,
    preferredDateEnd,
    preferredTimeStart,
    preferredTimeEnd,
    notes,
  } = body;

  if (!serviceId || !customerName || !customerEmail || !customerPhone || !preferredDateStart || !preferredDateEnd) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const cleanPhone = customerPhone.replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const service = queryOne<{ name: string }>(
    db,
    "SELECT name FROM services WHERE id = ? AND active = 1",
    [serviceId],
  );
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  db.run(
    `INSERT INTO waitlist (service_id, provider_id, customer_name, customer_email, customer_phone,
     preferred_date_start, preferred_date_end, preferred_time_start, preferred_time_end, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      serviceId,
      providerId || null,
      customerName.trim(),
      customerEmail.trim().toLowerCase(),
      cleanPhone,
      preferredDateStart,
      preferredDateEnd,
      preferredTimeStart || null,
      preferredTimeEnd || null,
      notes?.trim() || null,
    ],
  );

  const waitlistId = db.exec("SELECT last_insert_rowid()")[0]!.values[0]![0] as number;
  persist(db);

  return NextResponse.json({
    id: waitlistId,
    status: "active",
    message: "Your waitlist request has been submitted. This is not a confirmed appointment. We will contact you when a suitable opening becomes available.",
    service: service.name,
  }, { status: 201 });
}
