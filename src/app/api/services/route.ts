import { NextResponse } from "next/server";
import { getDb, queryAll } from "@/lib/db";

export async function GET() {
  const db = await getDb();

  const categories = queryAll(
    db,
    "SELECT id, name, slug, sort_order FROM categories WHERE active = 1 ORDER BY sort_order",
  );

  const services = queryAll(
    db,
    `SELECT s.id, s.category_id, s.name, s.description, s.price_cents, s.duration_minutes, s.sort_order,
            c.slug as category_slug, c.name as category_name
     FROM services s
     JOIN categories c ON c.id = s.category_id
     WHERE s.active = 1 AND c.active = 1
     ORDER BY c.sort_order, s.sort_order`,
  );

  return NextResponse.json({ categories, services });
}
