import initSqlJs, { type Database, type BindParams } from "sql.js";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "booking.db");

let db: Database | null = null;

function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file: string) =>
      path.join(process.cwd(), "node_modules", "sql.js", "dist", file),
  });

  ensureDataDir();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    createSchema(db);
    seedData(db);
    persist(db);
  }

  return db;
}

export function persist(database: Database) {
  ensureDataDir();
  const data = database.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function createSchema(database: Database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      sort_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER REFERENCES categories(id),
      name TEXT NOT NULL,
      description TEXT,
      price_cents INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      square_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS provider_services (
      provider_id INTEGER REFERENCES providers(id),
      service_id INTEGER REFERENCES services(id),
      PRIMARY KEY (provider_id, service_id)
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_id INTEGER REFERENCES providers(id),
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS time_off (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_id INTEGER REFERENCES providers(id),
      date TEXT NOT NULL,
      all_day INTEGER DEFAULT 1,
      start_time TEXT,
      end_time TEXT,
      reason TEXT
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER REFERENCES services(id),
      provider_id INTEGER REFERENCES providers(id),
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER REFERENCES services(id),
      provider_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      preferred_date_start TEXT NOT NULL,
      preferred_date_end TEXT NOT NULL,
      preferred_time_start TEXT,
      preferred_time_end TEXT,
      status TEXT DEFAULT 'active',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS business_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL UNIQUE,
      open_time TEXT NOT NULL,
      close_time TEXT NOT NULL,
      closed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function seedData(database: Database) {
  // Categories
  const cats = [
    ["Facials", "facials", 0],
    ["Dermaplaning", "dermaplaning", 1],
    ["Lash & Brow", "lash-brow", 2],
    ["Waxing", "waxing", 3],
    ["Laser Hair Removal", "laser", 4],
    ["Consultations", "consult", 5],
  ] as const;

  for (const [name, slug, order] of cats) {
    database.run(
      "INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)",
      [name, slug, order],
    );
  }

  // Get category IDs
  const catIds: Record<string, number> = {};
  const catRows = database.exec("SELECT id, slug FROM categories");
  if (catRows[0]) {
    for (const row of catRows[0].values) {
      catIds[row[1] as string] = row[0] as number;
    }
  }

  // Provider
  database.run(
    "INSERT INTO providers (name, title) VALUES (?, ?)",
    ["Natalie", "Owner & Lead Esthetician"],
  );
  const providerId = 1;

  // Business hours (placeholder — needs verification from owner)
  const hours = [
    [0, "09:00", "17:00", 1],
    [1, "09:00", "17:00", 0],
    [2, "09:00", "17:00", 0],
    [3, "09:00", "17:00", 0],
    [4, "09:00", "17:00", 0],
    [5, "09:00", "17:00", 0],
    [6, "09:00", "15:00", 0],
  ] as const;

  for (const [dow, open, close, closed] of hours) {
    database.run(
      "INSERT INTO business_hours (day_of_week, open_time, close_time, closed) VALUES (?, ?, ?, ?)",
      [dow, open, close, closed],
    );
    if (!closed) {
      database.run(
        "INSERT INTO schedules (provider_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)",
        [providerId, dow, open, close],
      );
    }
  }

  // Services — migrated from Square booking catalog
  const services: [string, string, number, number, string | null, string | null, number][] = [
    // [category_slug, name, price_cents, duration_min, description, square_id, sort_order]
    // Facials
    ["facials", "Skin Studio Facial", 12500, 60, "A European style facial is a classic, relaxing skincare treatment that typically includes deep cleansing, exfoliation, facial massage, and a mask tailored to the skin’s needs.", "2OEMVOESATGLX2YCAYLSFZ35", 0],
    ["facials", "Hydro Facial", 16500, 60, "One of the most powerful, non-invasive skin resurfacing treatments available. Combines cleansing, exfoliation, extraction, hydration and antioxidant protection.", "3FCCH367QOQ6SUA45NJB76BB", 1],
    ["facials", "MicroFusion", 35000, 70, "An innovative skincare treatment that combines microneedling with specialized serums to enhance skin rejuvenation, promoting collagen production and improving skin texture.", "G2ANYYRL6Q55CSOBKLIIKGCQ", 2],
    ["facials", "Customized Facial Peel", 20000, 60, "A tailored skin treatment that uses chemical solutions to exfoliate and rejuvenate the skin. Addresses specific concerns such as acne, hyperpigmentation, or aging.", "FNUG3M7RV76KDW7IEK2XBNNW", 3],
    ["facials", "Acne Eliminator", 12500, 60, "A professional and personalized approach to achieving clearer skin. Utilizes a powerful formula and advanced skincare techniques tailored to individual needs.", "DC6FI4S55T52BHYON3DJON7O", 4],
    ["facials", "Microdermabrasion Facial", 13000, 60, "A non-invasive procedure that exfoliates the skin’s surface using fine crystals or a diamond-tipped wand, resulting in brighter, smoother skin.", "X6C7YMIAMXHZBOVEEZ5UOPBG", 5],
    ["facials", "Photo Facial / IPL", 20000, 60, "The IPL Photofacial treatment uses short blasts of high-intensity light to produce younger-looking skin that’s firmer and more even in tone and texture.", "TLD4HORUHWYJ4RL7LCOMTVHC", 6],
    ["facials", "Acne Back Treatment", 15000, 55, "A specialized treatment designed to cleanse, exfoliate, and treat acne-prone skin on the back using scrubs, peels, extractions, and acne-fighting ingredients.", "WG27XQA5U57QRMCGZNDAACIF", 7],
    ["facials", "Teen Facial", 7500, 30, "For teens 14+. Includes a skin analyzation, a mini facial, and education on how to keep their skin clean and healthy.", "RU3F2TG654XUK55UQ4YDGMTT", 8],
    ["facials", "Sunspot Service", 20000, 50, "Removal of unwanted hyperpigmentation using the Cartessa Motus AX.", "HXBH2X4KD75GJ4QNPON6ZU3V", 9],

    // Dermaplaning
    ["dermaplaning", "Dermaplane Facial", 15000, 60, "A transformative skincare treatment that includes gentle manual exfoliation removing dead skin cells and fine vellus hair, a Green Tea Glycolic peel, and Copper peptide infusion.", "VGBBPFWZF2JMJ26JAL2ECXP2", 0],
    ["dermaplaning", "Dermaplaning", 4000, 30, "A superficial exfoliation procedure that uses a sterile surgical scalpel to gently exfoliate the top layer of dead skin cells and remove fine vellus hair. The perfect add-on to any service.", "5YIJY5NRPCZRQJSDNMN3OXRP", 1],
    ["dermaplaning", "Dermaplane with Lash Tint", 7500, 40, null, "YTONDJAINDOHRWXFT2Y6DIDE", 2],
    ["dermaplaning", "Dermaplane with Eyebrow Wax", 7000, 40, null, "GQTII3UPLHNMSRAFQETSRP6Q", 3],
    ["dermaplaning", "Dermaplaning with Eyebrow Wax", 7000, 30, null, "XKPVRGJ3NF6WTFZ6EEWZ3TLA", 4],

    // Lash & Brow
    ["lash-brow", "Lash Lift (No Lash Stain)", 7500, 45, null, "2GP53D3CICYXI4M5GYW3Q5GK", 0],
    ["lash-brow", "Lash Lift & Lash Stain/Tint", 10000, 60, null, "V22QACTUQBRD646YO4AAU6WB", 1],
    ["lash-brow", "Lash Stain/Tint", 4000, 15, null, "AQFXQRFY52C6VYW3JU42HZEQ", 2],
    ["lash-brow", "Lash Lift & Brow Wax", 12500, 30, null, "EW6RLVWUIN53R5UZST7DIUXW", 3],
    ["lash-brow", "Lash & Brow Tint Combo", 7500, 30, "Lash tint and brow tint. This service does not include a brow wax.", "6NWDARSQXV2WNQKCXZ2YEDYX", 4],
    ["lash-brow", "Eyebrow Stain", 3500, 20, null, "PRHZENQTUCJUCICVIUL257FL", 5],
    ["lash-brow", "Eyebrow Stain & Wax", 5000, 30, null, "S3OR3ESJDS65JHVUYKRAZ6ZQ", 6],

    // Waxing
    ["waxing", "Lip Wax", 1500, 5, null, "7GD7LSM5ELTCOZDK5B2Q4CNW", 0],
    ["waxing", "Eyebrow Wax", 3000, 15, null, "IHAFGFTQDUAEW7KCN6L5HQG7", 1],
    ["waxing", "Eyebrow & Lip Wax", 4000, 20, null, "V4E3AGONFNE4VTLBSTFGCJ6Y", 2],
    ["waxing", "Full Face Wax", 4500, 30, null, "2JI5QQI5YG6JCMYJO2PLN5HC", 3],
    ["waxing", "Ear Wax", 2000, 10, null, "7IHIBLEX5QCKUZVNA3JTQF7N", 4],
    ["waxing", "Nose Wax", 1500, 5, null, "TBHBQ7LZXHGFP4BOD4X3L35S", 5],

    // Laser Hair Removal
    ["laser", "Chin & Lip Laser", 12500, 15, "Upper lip and chin. Does not include the neck.", "QEWHJDSNADCMYNQSH2WKGEYH", 0],
    ["laser", "Lip & Chin Laser", 12000, 20, null, "LUG5RFAFF7YY4X7KIOTUGSKO", 1],
    ["laser", "Lip Laser", 7900, 10, null, "QUXM5TKJIR6M4AL6AM2CQNZ3", 2],
    ["laser", "Chin Laser", 9900, 10, null, "QHYVVLTOXDGMCG6BNT6E6JTK", 3],
    ["laser", "Full Face Laser", 20000, 15, "Includes Lip, Chin, Jawline, Unibrow, and Sideburns.", "TNFS5HYXOLGRBCSVZSIOLVK5", 4],
    ["laser", "Sideburns Laser", 9900, 30, null, "3HTYGDWFQUKLRPYF7ZMNU622", 5],
    ["laser", "Unibrow Laser", 7900, 30, null, "5QEXZQCQ2TJVGFOMGG2X7N3N", 6],
    ["laser", "Ears Laser", 7900, 30, null, "YLUE5ZOL2ETE5AEEGISU4M3U", 7],
    ["laser", "Beard Laser (includes Neck)", 15000, 30, null, "O63B7BFRX3PI5IUIZXDHYBI7", 8],
    ["laser", "Neck Laser", 9900, 20, "Neck only.", "LLIB25JHXDZFSMUM2LPH3Z2Z", 9],
    ["laser", "Under Arm Laser", 9900, 20, null, "NOROK7YQN7YDCTSKS5XNWAAV", 10],
    ["laser", "Half Arm Laser", 12500, 40, null, "4WPVE2BDMSTHD3MNY5WKJMYG", 11],
    ["laser", "Full Arm Laser", 15000, 60, null, "5X6ZVS2PQYPPM4X2ZLM7GX4W", 12],
    ["laser", "Shoulder Laser", 15000, 20, null, "4S3SVRJK7Z3HRRAYZUAOLBOB", 13],
    ["laser", "Chest Laser", 15000, 45, "Chest only. Does not include stomach or shoulders.", "B3JVHKNKTFOQWB6DJURZVWAF", 14],
    ["laser", "Stomach Laser", 15000, 40, "Does not include chest.", "657WYIVKLELMZXVHOH4PTZR5", 15],
    ["laser", "Full Torso Laser", 25000, 90, "Includes chest and stomach.", "PYSVPC2HTHJYHYCRVWIXH4KX", 16],
    ["laser", "Half Back Laser", 17500, 30, "Shoulders not included.", "JPJM7ITPLDEGDRQS7IR7FEJC", 17],
    ["laser", "Full Back Laser", 30000, 90, "Does not include shoulders.", "LXGAPW4ZWFV6AELZPTADLTC3", 18],
    ["laser", "Bikini Laser (Basic)", 9900, 30, "Includes outer edges of the bathing suit line. 3 inches outside of the underwear line.", "N3537P7Q3DZZX55S4K7SHHLB", 19],
    ["laser", "Bikini Plus Laser", 12000, 30, null, "RWSEOXN4NXATNNBWI3TVX66F", 20],
    ["laser", "Brazilian Laser", 15000, 30, "Entire pubic area including the labial area. Does not include the buttocks.", "Y6HJHEMTKQ62EZOC233A5EG3", 21],
    ["laser", "Male Brazilian Laser", 20000, 45, null, "SCTLPXT2ITXQFQXWIMISNLMW", 22],
    ["laser", "Butt Strip Laser", 7900, 10, "Strip of hair in-between the glutes.", "J7A6GSS4KA2DCBFQPAYEJYAH", 23],
    ["laser", "Buttocks Laser", 15000, 30, null, "GJNICY65OXWRMRON4IPPPDBM", 24],
    ["laser", "Half Leg Laser", 17500, 50, "Treats knee and lower leg or knee and upper thigh. Does not include bikini line.", "E64PRKPXHEZJNZR5LHBIMNMV", 25],
    ["laser", "Full Leg Laser", 30000, 70, null, "NZT4NN5GRZ22WNYGSFGIMIG2", 26],
    ["laser", "Finger or Toe Laser", 7500, 20, null, "5UUQJ6HL75Q4HKHDIIGCMMPP", 27],

    // Consultations
    ["consult", "Facial Consultation", 2500, 30, null, "EIYI3F272TJCWA4SABLZQZZ4", 0],
    ["consult", "Laser Hair Removal Consultation", 2500, 20, null, "VPP7DXS5FLVPHOGI7H2O5BVQ", 1],
  ];

  const insertService = database.prepare(
    "INSERT INTO services (category_id, name, price_cents, duration_minutes, description, square_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  for (const [catSlug, name, price, duration, desc, sqId, order] of services) {
    const catId = catIds[catSlug];
    insertService.run([catId, name, price, duration, desc, sqId, order]);

    const svcId = database.exec("SELECT last_insert_rowid()")[0]!.values[0]![0] as number;
    database.run(
      "INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)",
      [providerId, svcId],
    );
  }

  insertService.free();
}

// Helper: run a query and return rows as objects
export function queryAll<T = Record<string, unknown>>(
  database: Database,
  sql: string,
  params: unknown[] = [],
): T[] {
  const stmt = database.prepare(sql);
  stmt.bind(params as unknown as BindParams);

  const results: T[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as T;
    results.push(row);
  }
  stmt.free();
  return results;
}

export function queryOne<T = Record<string, unknown>>(
  database: Database,
  sql: string,
  params: unknown[] = [],
): T | null {
  const rows = queryAll<T>(database, sql, params);
  return rows[0] ?? null;
}
