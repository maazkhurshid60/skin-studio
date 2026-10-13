import fs from 'fs';

const data = JSON.parse(fs.readFileSync('parsed_square_data.json', 'utf8'));

const catMap = {};
(data.categories || []).forEach(c => {
  catMap[c.id] = c.name;
});

const serviceList = data.services.map(s => {
  const variation = (s.variations && s.variations[0]) || {};
  const priceCents = variation.price_cents ?? s.price_cents ?? 0;
  const durationSeconds = variation.service_time ?? s.time ?? 0;
  const durationMinutes = Math.round(durationSeconds / 60);
  const catName = catMap[s.category_token] || 'Other';
  
  return {
    id: s.id,
    cogs_id: s.cogs_id,
    name: s.name,
    category_id: s.category_token,
    category_name: catName,
    price_cents: priceCents,
    price_formatted: `$${(priceCents / 100).toFixed(priceCents % 100 === 0 ? 0 : 2)}`,
    duration_minutes: durationMinutes,
    duration_formatted: durationMinutes < 60 ? `${durationMinutes} min` : `${Math.floor(durationMinutes / 60)} hr${durationMinutes % 60 ? ` ${durationMinutes % 60} min` : ''}`,
    description: s.description || '',
    square_url: `https://book.squareup.com/appointments/a1866bee-e25a-447d-a0ee-039f76a608d6/location/5V21SB1DSG5AG/services/${s.id}`
  };
});

fs.writeFileSync('extracted_square_services.json', JSON.stringify(serviceList, null, 2));

const breakdown = {};
serviceList.forEach(s => {
  breakdown[s.category_name] = (breakdown[s.category_name] || 0) + 1;
});
console.log('Services by category:', breakdown);

// Show list of categories with service names
const byCat = {};
serviceList.forEach(s => {
  if (!byCat[s.category_name]) byCat[s.category_name] = [];
  byCat[s.category_name].push(`${s.name} (${s.price_formatted}, ${s.duration_formatted}, id: ${s.id})`);
});
console.log(JSON.stringify(byCat, null, 2));
