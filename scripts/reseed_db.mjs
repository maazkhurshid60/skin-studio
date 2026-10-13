import fs from 'fs';
import initSqlJs from 'sql.js';

async function reseed() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(`
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
      provider_id INTEGER REFERENCES providers(id),
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

  const cats = [
    ['Facials', 'facials', 0],
    ['Laser Hair Removal', 'laser', 1],
    ['Lash & Brow', 'lash-brow', 2],
    ['Waxing', 'waxing', 3],
    ['Dermaplaning & Minis', 'dermaplaning', 4],
    ['Consultations', 'consult', 5],
  ];

  for (const [name, slug, order] of cats) {
    db.run('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)', [name, slug, order]);
  }

  const catIds = {};
  const catRows = db.exec('SELECT id, slug FROM categories');
  for (const row of catRows[0].values) {
    catIds[row[1]] = row[0];
  }

  db.run('INSERT INTO providers (name, title) VALUES (?, ?)', ['Natalie', 'Owner & Lead Esthetician']);
  const providerId = 1;

  const hours = [
    [0, '09:00', '17:00', 1],
    [1, '09:00', '17:00', 0],
    [2, '09:00', '17:00', 0],
    [3, '09:00', '17:00', 0],
    [4, '09:00', '17:00', 0],
    [5, '09:00', '17:00', 0],
    [6, '09:00', '15:00', 0],
  ];

  for (const [dow, open, close, closed] of hours) {
    db.run('INSERT INTO business_hours (day_of_week, open_time, close_time, closed) VALUES (?, ?, ?, ?)', [dow, open, close, closed]);
    if (!closed) {
      db.run('INSERT INTO schedules (provider_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)', [providerId, dow, open, close]);
    }
  }

  const services = [
    // Facials (11)
    ['facials', 'Skin Studio Facial', 12500, 60, 'A European style facial is a classic, relaxing skincare treatment that typically includes deep cleansing, exfoliation, facial massage, and a mask tailored to the skin’s needs. Emphasizes hydration and rejuvenation.', '2OEMVOESATGLX2YCAYLSFZ35', 0],
    ['facials', 'Hydro Facial', 16500, 60, 'One of the most powerful, non-invasive skin resurfacing treatments available. Combines cleansing, exfoliation, extraction, hydration and antioxidant protection.', '3FCCH367QOQ6SUA45NJB76BB', 1],
    ['facials', 'MicroFusion', 35000, 70, 'An innovative skincare treatment that combines microneedling with specialized serums to enhance skin rejuvenation, promoting collagen production and improving skin texture.', 'G2ANYYRL6Q55CSOBKLIIKGCQ', 2],
    ['facials', 'Customized Facial Peel', 20000, 60, 'A tailored skin treatment that uses chemical solutions to exfoliate and rejuvenate the skin. Addresses specific concerns such as acne, hyperpigmentation, or aging.', 'FNUG3M7RV76KDW7IEK2XBNNW', 3],
    ['facials', 'Acne Eliminator', 12500, 60, 'A professional and personalized approach to achieving clearer skin. Utilizes a powerful formula and advanced skincare techniques tailored to individual needs.', 'DC6FI4S55T52BHYON3DJON7O', 4],
    ['facials', 'Microdermabrasion Facial', 13000, 60, 'A non-invasive procedure that exfoliates the skin’s surface using fine crystals or a diamond-tipped wand, resulting in brighter, smoother skin.', 'X6C7YMIAMXHZBOVEEZ5UOPBG', 5],
    ['facials', 'Photo Facial', 20000, 60, 'The IPL Photofacial treatment uses short blasts of high-intensity light to produce younger-looking skin that’s firmer and more even in tone and texture.', 'TLD4HORUHWYJ4RL7LCOMTVHC', 6],
    ['facials', 'Acne Back Treatment', 15000, 55, 'A specialized treatment designed to cleanse, exfoliate, and treat acne-prone skin on the back using scrubs, peels, extractions, and acne-fighting ingredients.', 'WG27XQA5U57QRMCGZNDAACIF', 7],
    ['facials', 'Teen facial', 7500, 30, 'For teens 14+. Includes a skin analyzation, a mini facial, and education on how to keep skin clean and healthy.', 'RU3F2TG654XUK55UQ4YDGMTT', 8],
    ['facials', 'Sunspot service', 20000, 50, 'Removal of unwanted hyperpigmentation using Cartessa Motus AX.', 'HXBH2X4KD75GJ4QNPON6ZU3V', 9],
    ['facials', 'Dermaplane Facial', 15000, 60, 'A transformative skincare treatment that includes gentle manual exfoliation, a Green Tea Glycolic peel, and Copper peptide infusion for the ultimate glow.', 'VGBBPFWZF2JMJ26JAL2ECXP2', 10],

    // Laser Hair Removal (29)
    ['laser', 'Laser hair removal consultation', 2500, 20, 'Consultation to evaluate skin, hair type, and determine an optimal laser treatment plan.', 'VPP7DXS5FLVPHOGI7H2O5BVQ', 0],
    ['laser', 'Lip Laser', 7900, 10, 'Laser hair removal for the upper lip area.', 'QUXM5TKJIR6M4AL6AM2CQNZ3', 1],
    ['laser', 'Chin Laser', 9900, 10, 'Targeted laser treatment for the chin area.', 'QHYVVLTOXDGMCG6BNT6E6JTK', 2],
    ['laser', 'Lip & Chin laser', 12000, 20, 'Combined upper lip and chin laser hair removal.', 'LUG5RFAFF7YY4X7KIOTUGSKO', 3],
    ['laser', 'Chin & Lip Laser', 12500, 15, 'Upper lip and chin laser treatment. Does not include neck.', 'QEWHJDSNADCMYNQSH2WKGEYH', 4],
    ['laser', 'Full Face Laser', 20000, 15, 'Includes Lip, Chin, Jawline, Unibrow, and Sideburns.', 'TNFS5HYXOLGRBCSVZSIOLVK5', 5],
    ['laser', 'Sideburns Laser Hair Removal', 9900, 30, 'Precision laser hair removal for sideburns.', '3HTYGDWFQUKLRPYF7ZMNU622', 6],
    ['laser', 'Unibrow Laser Hair Removal', 7900, 30, 'Targeted laser treatment between the brows.', '5QEXZQCQ2TJVGFOMGG2X7N3N', 7],
    ['laser', 'Ears Laser Hair Removal', 7900, 30, 'Precision laser hair removal for the outer ears.', 'YLUE5ZOL2ETE5AEEGISU4M3U', 8],
    ['laser', 'Neck Laser', 9900, 20, 'Neck only laser hair removal.', 'LLIB25JHXDZFSMUM2LPH3Z2Z', 9],
    ['laser', 'Beard Laser includes Neck', 15000, 30, 'Full beard shaping and neck laser treatment.', 'O63B7BFRX3PI5IUIZXDHYBI7', 10],
    ['laser', 'Under Arm Laser', 9900, 20, 'Gentle and effective underarm laser hair removal.', 'NOROK7YQN7YDCTSKS5XNWAAV', 11],
    ['laser', 'Half Arm Laser', 12500, 40, 'Upper or lower arms laser treatment.', '4WPVE2BDMSTHD3MNY5WKJMYG', 12],
    ['laser', 'Full Arm Laser', 15000, 60, 'Complete arm coverage from shoulder to wrist.', '5X6ZVS2PQYPPM4X2ZLM7GX4W', 13],
    ['laser', 'Finger or Toe Laser', 7500, 20, 'Targeted laser treatment for fingers or toes.', '5UUQJ6HL75Q4HKHDIIGCMMPP', 14],
    ['laser', 'Shoulder Laser', 15000, 20, 'Shoulder area laser hair removal.', '4S3SVRJK7Z3HRRAYZUAOLBOB', 15],
    ['laser', 'Chest Laser', 15000, 45, 'Chest only. Does not include stomach or shoulders.', 'B3JVHKNKTFOQWB6DJURZVWAF', 16],
    ['laser', 'Stomach Laser', 15000, 40, 'Does not include chest.', '657WYIVKLELMZXVHOH4PTZR5', 17],
    ['laser', 'Full Torso', 25000, 90, 'Includes chest and stomach.', 'PYSVPC2HTHJYHYCRVWIXH4KX', 18],
    ['laser', 'Half Back Laser', 17500, 30, 'Half back laser. Shoulders not included.', 'JPJM7ITPLDEGDRQS7IR7FEJC', 19],
    ['laser', 'Full Back Laser', 25000, 90, 'Full back laser. Does not include shoulders.', 'LXGAPW4ZWFV6AELZPTADLTC3', 20],
    ['laser', 'Bikini Laser ( Basic)', 9900, 30, 'Basic Bikini Laser includes outer edges of bathing suit line (3 inches outside underwear line).', 'N3537P7Q3DZZX55S4K7SHHLB', 21],
    ['laser', 'Bikini Plus Laser Hair Removal', 12000, 30, 'Extended bikini area laser treatment.', 'RWSEOXN4NXATNNBWI3TVX66F', 22],
    ['laser', 'Brazilian Laser', 15000, 30, 'Brazilian Laser for men or women covers entire pubic area including labial area. Buttocks not included.', 'Y6HJHEMTKQ62EZOC233A5EG3', 23],
    ['laser', 'Male Brazilian Laser', 20000, 45, 'Comprehensive male Brazilian laser hair removal.', 'SCTLPXT2ITXQFQXWIMISNLMW', 24],
    ['laser', 'Butt Strip Laser', 7900, 10, 'Strip of hair in-between the glutes.', 'J7A6GSS4KA2DCBFQPAYEJYAH', 25],
    ['laser', 'Buttocks Laser', 15000, 30, 'Full buttocks area laser hair removal.', 'GJNICY65OXWRMRON4IPPPDBM', 26],
    ['laser', 'Half Leg Laser', 15000, 50, 'Treats knee and lower leg or knee and upper thigh. Does not include bikini line.', 'E64PRKPXHEZJNZR5LHBIMNMV', 27],
    ['laser', 'Full Leg Laser', 30000, 70, 'Comprehensive full leg laser treatment from upper thigh to ankle.', 'NZT4NN5GRZ22WNYGSFGIMIG2', 28],

    // Lash & Brow (7)
    ['lash-brow', 'Eyebrow Stain', 3500, 20, 'Long-lasting eyebrow stain for fuller, defined brows.', 'PRHZENQTUCJUCICVIUL257FL', 0],
    ['lash-brow', 'Eyebrow Stain & Wax', 5000, 30, 'Combined eyebrow stain with custom waxing and shaping.', 'S3OR3ESJDS65JHVUYKRAZ6ZQ', 1],
    ['lash-brow', 'Lash Lift (No Lash Stain)', 7500, 45, 'Semi-permanent lash perm providing beautiful natural curl without tint.', '2GP53D3CICYXI4M5GYW3Q5GK', 2],
    ['lash-brow', 'Lash Lift & Lash Stain/Tint', 10000, 60, 'Lash lift combined with dark tint for a voluminous, eye-opening effect.', 'V22QACTUQBRD646YO4AAU6WB', 3],
    ['lash-brow', 'Lash Stain/Tint', 4000, 15, 'Deep lash tint for rich, mascara-free definition.', 'AQFXQRFY52C6VYW3JU42HZEQ', 4],
    ['lash-brow', 'Lash lift & brow wax', 12500, 30, 'Lash lift bundled with brow shaping wax.', 'EW6RLVWUIN53R5UZST7DIUXW', 5],
    ['lash-brow', 'Lash & brow tint combo', 7000, 30, 'Lash tint and brow tint combo. Does not include brow wax.', '6NWDARSQXV2WNQKCXZ2YEDYX', 6],

    // Waxing (6)
    ['waxing', 'Eyebrow Wax', 3000, 15, 'Precision eyebrow waxing and shaping.', 'IHAFGFTQDUAEW7KCN6L5HQG7', 0],
    ['waxing', 'Lip Wax', 1500, 5, 'Quick and gentle upper lip hair removal.', '7GD7LSM5ELTCOZDK5B2Q4CNW', 1],
    ['waxing', 'Eyebrow & Lip wax', 4000, 20, 'Combination eyebrow shaping and upper lip wax.', 'V4E3AGONFNE4VTLBSTFGCJ6Y', 2],
    ['waxing', 'Full Face Wax', 4500, 30, 'Complete facial waxing including brows, lip, chin, and cheeks.', '2JI5QQI5YG6JCMYJO2PLN5HC', 3],
    ['waxing', 'Ear Wax', 2000, 10, 'Gentle ear hair removal waxing.', '7IHIBLEX5QCKUZVNA3JTQF7N', 4],
    ['waxing', 'Nose Wax', 1500, 5, 'Quick and hygienic nostril waxing.', 'TBHBQ7LZXHGFP4BOD4X3L35S', 5],

    // Dermaplaning & Minis (6)
    ['dermaplaning', 'Dermaplaning', 4000, 30, 'Superficial exfoliation using a sterile surgical scalpel to remove dead skin cells and fine peach fuzz. The perfect add-on.', '5YIJY5NRPCZRQJSDNMN3OXRP', 0],
    ['dermaplaning', 'Dermaplane with Lash Tint', 7000, 40, 'Exfoliating dermaplane treatment paired with deep lash tint.', 'YTONDJAINDOHRWXFT2Y6DIDE', 1],
    ['dermaplaning', 'Dermaplane with Lash Tint (Studio)', 7000, 40, 'Exfoliating dermaplane treatment paired with deep lash tint.', '6B6QJOBUWTJDV7G5Q5YBA5PD', 2],
    ['dermaplaning', 'Dermaplane with  Eyebrow wax', 7000, 40, 'Dermaplane exfoliation combined with custom eyebrow waxing.', 'GQTII3UPLHNMSRAFQETSRP6Q', 3],
    ['dermaplaning', 'Dermaplaning with Eyebrow wax', 7000, 30, 'Full dermaplaning session with eyebrow wax shaping.', 'XKPVRGJ3NF6WTFZ6EEWZ3TLA', 4],
    ['dermaplaning', 'High Frequency Treatment', 5000, 30, 'Targeted electrical high-frequency treatment to eliminate acne bacteria and stimulate circulation.', 'NLYVY5LZNMSTAYSJNHHQBPIM', 5],

    // Consultations (1)
    ['consult', 'Facial Consult', 2500, 30, 'One-on-one consultation with Natalie to analyze skin and design a tailored treatment regimen.', 'EIYI3F272TJCWA4SABLZQZZ4', 0]
  ];

  const insert = db.prepare('INSERT INTO services (category_id, name, price_cents, duration_minutes, description, square_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const [slug, name, price, dur, desc, sqId, order] of services) {
    const catId = catIds[slug];
    insert.run([catId, name, price, dur, desc, sqId, order]);
    const svcId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    db.run('INSERT INTO provider_services (provider_id, service_id) VALUES (?, ?)', [providerId, svcId]);
  }
  insert.free();

  const data = db.export();
  fs.writeFileSync('data/booking.db', Buffer.from(data));
  console.log('Successfully reseeded booking.db with', services.length, 'services!');
}

reseed().catch(console.error);
