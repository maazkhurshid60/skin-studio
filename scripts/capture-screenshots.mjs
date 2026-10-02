import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3001";
const OUT = path.resolve("screenshots");
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812, isMobile: true, hasTouch: true };

const pages = [
  { slug: "home", path: "/", title: "Home Page" },
  { slug: "about", path: "/about", title: "About Page" },
  { slug: "team", path: "/team", title: "Our Team" },
  { slug: "services", path: "/services", title: "Services Overview" },
  { slug: "facial-treatments", path: "/services/facial-treatments", title: "Facial Treatments" },
  { slug: "micro-infusion", path: "/services/micro-infusion-facial", title: "Micro-Infusion Facial" },
  { slug: "ipl-treatments", path: "/services/ipl-treatments", title: "Photo Facial / IPL" },
  { slug: "laser-hair-removal", path: "/services/laser-hair-removal", title: "Laser Hair Removal" },
  { slug: "lash-services", path: "/services/lash-services", title: "Lash Services" },
  { slug: "offers", path: "/offers", title: "Special Offers" },
  { slug: "book", path: "/book", title: "Book Appointment" },
  { slug: "gift-card", path: "/product/gift-card", title: "Gift Certificates" },
  { slug: "contact", path: "/contact", title: "Contact Us" },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 80);
    });
  });
  await wait(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
}

async function capturePage(page, pg, viewport, folder) {
  await page.setViewport(viewport);
  await page.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle0", timeout: 30000 });
  await wait(800);

  // Scroll to bottom to trigger all whileInView animations
  await scrollToBottom(page);

  // Force lazy images
  await page.evaluate(() => {
    document.querySelectorAll("img[loading='lazy']").forEach((img) => {
      img.loading = "eager";
      const src = img.src;
      img.src = "";
      img.src = src;
    });
  });
  await wait(1000);

  // Force any remaining hidden elements visible
  await page.evaluate(() => {
    document.querySelectorAll("*").forEach((el) => {
      const style = getComputedStyle(el);
      if (parseFloat(style.opacity) < 0.1 && el.tagName !== "SCRIPT" && el.tagName !== "STYLE" && el.tagName !== "LINK") {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
  });
  await wait(500);

  await page.screenshot({
    path: path.join(OUT, folder, `${pg.slug}.png`),
    fullPage: true,
    type: "png",
  });
}

async function capture() {
  fs.mkdirSync(path.join(OUT, "desktop"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "mobile"), { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  for (const pg of pages) {
    console.log(`Capturing: ${pg.title} (${pg.path})`);

    await capturePage(page, pg, DESKTOP, "desktop");
    console.log(`  Desktop done`);

    await capturePage(page, pg, MOBILE, "mobile");
    console.log(`  Mobile done`);
  }

  await browser.close();
  console.log(`\nAll screenshots saved to: ${OUT}`);
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
