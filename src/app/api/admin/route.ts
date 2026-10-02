import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll, queryOne, persist } from "@/lib/db";

const ADMIN_KEY = process.env.ADMIN_KEY || "skin-studio-admin-dev";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("x-admin-key");
  return auth === ADMIN_KEY;
}

// GET /api/admin?view=appointments|waitlist|services|providers|dashboard
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const view = request.nextUrl.searchParams.get("view") || "dashboard";

  if (view === "dashboard") {
    const pending = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
    const confirmed = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM appointments WHERE status = 'confirmed'");
    const waitlist = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM waitlist WHERE status = 'active'");
    const services = queryOne<{ count: number }>(db, "SELECT COUNT(*) as count FROM services WHERE active = 1");

    return NextResponse.json({
      pending: pending?.count ?? 0,
      confirmed: confirmed?.count ?? 0,
      waitlist: waitlist?.count ?? 0,
      activeServices: services?.count ?? 0,
    });
  }

  if (view === "appointments") {
    const status = request.nextUrl.searchParams.get("status");
    let sql = `SELECT a.*, s.name as service_name, s.price_cents, s.duration_minutes, p.name as provider_name
               FROM appointments a
               JOIN services s ON s.id = a.service_id
               JOIN providers p ON p.id = a.provider_id`;
    const params: unknown[] = [];
    if (status) {
      sql += " WHERE a.status = ?";
      params.push(status);
    }
    sql += " ORDER BY a.date DESC, a.start_time DESC";
    return NextResponse.json({ appointments: queryAll(db, sql, params) });
  }

  if (view === "waitlist") {
    const items = queryAll(
      db,
      `SELECT w.*, s.name as service_name, p.name as provider_name
       FROM waitlist w
       JOIN services s ON s.id = w.service_id
       LEFT JOIN providers p ON p.id = w.provider_id
       ORDER BY w.created_at DESC`,
    );
    return NextResponse.json({ waitlist: items });
  }

  if (view === "services") {
    const items = queryAll(
      db,
      `SELECT s.*, c.name as category_name, c.slug as category_slug
       FROM services s JOIN categories c ON c.id = s.category_id
       ORDER BY c.sort_order, s.sort_order`,
    );
    return NextResponse.json({ services: items });
  }

  if (view === "providers") {
    const items = queryAll(db, "SELECT * FROM providers ORDER BY id");
    return NextResponse.json({ providers: items });
  }

  return NextResponse.json({ error: "Unknown view" }, { status: 400 });
}

// PUT /api/admin — update appointment/waitlist status, edit services/providers
export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const body = await request.json();
  const { action } = body;

  if (action === "update-appointment") {
    const { id, status } = body;
    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    db.run("UPDATE appointments SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
    persist(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "update-waitlist") {
    const { id, status } = body;
    if (!["active", "contacted", "booked", "expired"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    db.run("UPDATE waitlist SET status = ?, updated_at = datetime('now') WHERE id = ?", [status, id]);
    persist(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "update-service") {
    const { id, active, priceCents, durationMinutes, description } = body;
    if (active !== undefined) {
      db.run("UPDATE services SET active = ?, updated_at = datetime('now') WHERE id = ?", [active ? 1 : 0, id]);
    }
    if (priceCents !== undefined) {
      db.run("UPDATE services SET price_cents = ?, updated_at = datetime('now') WHERE id = ?", [priceCents, id]);
    }
    if (durationMinutes !== undefined) {
      db.run("UPDATE services SET duration_minutes = ?, updated_at = datetime('now') WHERE id = ?", [durationMinutes, id]);
    }
    if (description !== undefined) {
      db.run("UPDATE services SET description = ?, updated_at = datetime('now') WHERE id = ?", [description, id]);
    }
    persist(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "update-provider") {
    const { id, active, name, title } = body;
    if (active !== undefined) {
      db.run("UPDATE providers SET active = ? WHERE id = ?", [active ? 1 : 0, id]);
    }
    if (name) {
      db.run("UPDATE providers SET name = ? WHERE id = ?", [name, id]);
    }
    if (title !== undefined) {
      db.run("UPDATE providers SET title = ? WHERE id = ?", [title, id]);
    }
    persist(db);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
