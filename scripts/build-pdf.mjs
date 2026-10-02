import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

const SRC = path.resolve("screenshots", "final");
const OUT = path.resolve("screenshots", "Skin-Studio-Ithaca-UI-Design-Full-Pages.pdf");
const MAX_PT = 14400; // PDF viewer page-size limit (200 in)

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".jpg")).sort();

const pdf = await PDFDocument.create();
pdf.setTitle("Skin Studio Ithaca — UI Design");
pdf.setAuthor("Skin Studio Ithaca");

for (const f of files) {
  const img = await pdf.embedJpg(fs.readFileSync(path.join(SRC, f)));
  const scale = Math.min(0.75, MAX_PT / img.height, MAX_PT / img.width);
  const w = img.width * scale;
  const h = img.height * scale;
  pdf.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h });
  console.log(`${f}  ${img.width}x${img.height}px`);
}

fs.writeFileSync(OUT, await pdf.save());
console.log(`\n${files.length} pages -> ${OUT} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB)`);
