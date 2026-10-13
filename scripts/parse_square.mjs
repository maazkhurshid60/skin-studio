import fs from 'fs';

const html = fs.readFileSync('square_services_raw.html', 'utf8');
const match = html.match(/<meta\s+name="widget"\s+content="([^"]+)"/);
if (!match) {
  console.log('No match found');
  process.exit(1);
}

// Decode HTML entities
const decoded = match[1]
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const parsed = JSON.parse(decoded);
fs.writeFileSync('parsed_square_data.json', JSON.stringify(parsed, null, 2));
console.log('Parsed successfully!');
console.log('Keys in widget payload:', Object.keys(parsed));
if (parsed.items) {
  console.log('Total items in parsed.items:', parsed.items.length);
}
if (parsed.categories) {
  console.log('Categories:', parsed.categories.map(c => c.name || c.title));
}
