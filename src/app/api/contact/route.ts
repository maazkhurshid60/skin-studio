import { NextRequest, NextResponse } from "next/server";
import { getDb, persist } from "@/lib/db";

export async function POST(request: NextRequest) {
  const db = await getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  let body: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { name, email, phone, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  db.run(
    "INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)",
    [name.trim(), email.trim().toLowerCase(), phone?.trim() || null, message.trim()],
  );

  const id = db.exec("SELECT last_insert_rowid()")[0]!.values[0]![0] as number;
  persist(db);

  return NextResponse.json(
    {
      id,
      message:
        "Your message has been received. We will get back to you as soon as possible.",
    },
    { status: 201 },
  );
}
