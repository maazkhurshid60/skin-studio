import { NextRequest, NextResponse } from "next/server";
import { getDb, queryAll } from "@/lib/db";

export async function GET(request: NextRequest) {
  const db = await getDb();
  const serviceId = request.nextUrl.searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json({ error: "serviceId required" }, { status: 400 });
  }

  const providers = queryAll(
    db,
    `SELECT p.id, p.name, p.title
     FROM providers p
     JOIN provider_services ps ON ps.provider_id = p.id
     WHERE ps.service_id = ? AND p.active = 1`,
    [Number(serviceId)],
  );

  return NextResponse.json({ providers });
}
