import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, queryOne } from "@/lib/db";

const ITHACA_TZ = "America/New_York";
const SLOT_INTERVAL = 15; // minutes between slot starts

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  const db = await getDb();
  const { searchParams } = request.nextUrl;
  const serviceId = searchParams.get("serviceId");
  const providerId = searchParams.get("providerId");
  const date = searchParams.get("date");

  if (!serviceId || !providerId || !date) {
    return NextResponse.json(
      { error: "serviceId, providerId, and date are required" },
      { status: 400 },
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Don't allow dates in the past (Ithaca time)
  const now = new Date();
  const ithacaNow = new Date(now.toLocaleString("en-US", { timeZone: ITHACA_TZ }));
  const requestDate = new Date(date + "T00:00:00");
  const todayStr = `${ithacaNow.getFullYear()}-${String(ithacaNow.getMonth() + 1).padStart(2, "0")}-${String(ithacaNow.getDate()).padStart(2, "0")}`;

  if (date < todayStr) {
    return NextResponse.json({ slots: [], message: "Date is in the past" });
  }

  // Get service duration
  const service = queryOne<{ duration_minutes: number }>(
    db,
    "SELECT duration_minutes FROM services WHERE id = ? AND active = 1",
    [Number(serviceId)],
  );
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  const duration = service.duration_minutes;

  // Get day of week for this date
  const dayOfWeek = new Date(date + "T12:00:00").getDay();

  // Check business hours
  const bh = queryOne<{ open_time: string; close_time: string; closed: number }>(
    db,
    "SELECT open_time, close_time, closed FROM business_hours WHERE day_of_week = ?",
    [dayOfWeek],
  );
  if (!bh || bh.closed) {
    return NextResponse.json({ slots: [], message: "Closed on this day" });
  }

  // Check provider schedule for this day
  const schedule = queryOne<{ start_time: string; end_time: string }>(
    db,
    "SELECT start_time, end_time FROM schedules WHERE provider_id = ? AND day_of_week = ? AND active = 1",
    [Number(providerId), dayOfWeek],
  );
  if (!schedule) {
    return NextResponse.json({ slots: [], message: "Provider not available on this day" });
  }

  // Check provider time off
  const timeOff = queryOne<{ all_day: number; start_time: string | null; end_time: string | null }>(
    db,
    "SELECT all_day, start_time, end_time FROM time_off WHERE provider_id = ? AND date = ?",
    [Number(providerId), date],
  );
  if (timeOff && timeOff.all_day) {
    return NextResponse.json({ slots: [], message: "Provider is off on this day" });
  }

  // Calculate window
  const windowStart = toMinutes(schedule.start_time);
  const windowEnd = toMinutes(schedule.end_time);

  // Get existing appointments for this provider on this date
  const appointments = queryAll<{ start_time: string; end_time: string }>(
    db,
    "SELECT start_time, end_time FROM appointments WHERE provider_id = ? AND date = ? AND status IN ('pending', 'confirmed')",
    [Number(providerId), date],
  );

  const bookedSlots = appointments.map((a) => ({
    start: toMinutes(a.start_time),
    end: toMinutes(a.end_time),
  }));

  // Handle partial time off
  const offSlots: { start: number; end: number }[] = [];
  if (timeOff && !timeOff.all_day && timeOff.start_time && timeOff.end_time) {
    offSlots.push({
      start: toMinutes(timeOff.start_time),
      end: toMinutes(timeOff.end_time),
    });
  }

  // Generate available slots
  const slots: string[] = [];
  const currentMinutes = date === todayStr
    ? ithacaNow.getHours() * 60 + ithacaNow.getMinutes() + 30 // 30 min buffer for today
    : 0;

  for (let start = windowStart; start + duration <= windowEnd; start += SLOT_INTERVAL) {
    if (start < currentMinutes) continue;

    const end = start + duration;

    const overlapsBooking = bookedSlots.some(
      (b) => start < b.end && end > b.start,
    );

    const overlapsOff = offSlots.some(
      (o) => start < o.end && end > o.start,
    );

    if (!overlapsBooking && !overlapsOff) {
      slots.push(fromMinutes(start));
    }
  }

  return NextResponse.json({
    slots,
    date,
    timezone: ITHACA_TZ,
    providerId: Number(providerId),
    duration,
  });
}
