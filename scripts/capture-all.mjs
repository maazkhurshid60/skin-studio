import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const BASE = "http://localhost:3001";
const OUT = path.resolve("screenshots", "final");
const VIEW = { width: 1440, height: 900 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const mainPages = [
  ["01-home", "/"],
  ["02-about", "/about"],
  ["03-team", "/team"],
  ["04-services", "/services"],
  ["05-facial-treatments", "/services/facial-treatments"],
  ["06-micro-infusion", "/services/micro-infusion-facial"],
  ["07-ipl-treatments", "/services/ipl-treatments"],
  ["08-laser-hair-removal", "/services/laser-hair-removal"],
  ["09-lash-services", "/services/lash-services"],
  ["10-offers", "/offers"],
  ["11-book", "/book"],
  ["12-gift-card", "/product/gift-card"],
  ["13-contact", "/contact"],
];

const HIDE_DEV = `nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }`;

async function prepare(page) {
  await page.addStyleTag({ content: HIDE_DEV });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((img) => { img.loading = "eager"; });
    await Promise.all(imgs.map((img) => img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })));
    document.querySelectorAll("body *").forEach((el) => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
  });
  await wait(700);
}

async function open(page, url) {
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle0", timeout: 60000 });
  await wait(600);
  await prepare(page);
}

const shot = (page, name, opts = {}) =>
  page.screenshot({ path: path.join(OUT, `${name}.jpg`), type: "jpeg", quality: 92, ...opts });

async function clickText(page, text, exact = false) {
  const ok = await page.evaluate((t, ex) => {
    const b = [...document.querySelectorAll("button")].find((el) =>
      ex ? el.textContent.trim() === t : el.textContent.includes(t));
    if (b) b.click();
    return !!b;
  }, text, exact);
  if (!ok) throw new Error(`Button not found: ${text}`);
  await wait(900);
}

async function typeInto(page, placeholder, value) {
  const el = await page.$(`[placeholder="${placeholder}"]`);
  if (!el) throw new Error(`Input not found: ${placeholder}`);
  await el.click({ clickCount: 3 });
  await el.type(value, { delay: 5 });
}

async function sectionShot(page, name, anchorText) {
  await prepare(page);
  const handle = await page.evaluateHandle((t) => {
    const all = [...document.querySelectorAll("h1,h2,h3,h4,p,button,span")];
    const hit = all.find((el) => el.textContent.trim().startsWith(t));
    return hit ? hit.closest("section") : null;
  }, anchorText);
  const el = handle.asElement();
  if (!el) throw new Error(`Section not found for: ${anchorText}`);
  await el.screenshot({ path: path.join(OUT, `${name}.jpg`), type: "jpeg", quality: 92 });
}

async function run() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"], defaultViewport: VIEW });
  const page = await browser.newPage();

  for (const [name, url] of mainPages) {
    console.log("Page:", name);
    await open(page, url);
    await shot(page, name, { fullPage: true });
  }

  console.log("Dropdowns");
  await open(page, "/");
  for (const [name, href] of [["20-dropdown-services", "/services"], ["21-dropdown-about", "/about"]]) {
    await page.mouse.move(0, 600);
    await wait(300);
    await (await page.$(`header a[href="${href}"]`)).hover();
    await wait(700);
    await shot(page, name);
  }

  console.log("Gift card flow");
  await open(page, "/product/gift-card");
  await clickText(page, "Continue", true);
  await sectionShot(page, "22-giftcard-validation", "Choose an Amount");
  await clickText(page, "$50", true);
  await clickText(page, "Continue", true);
  await sectionShot(page, "23-giftcard-step2-details", "Gift Details");
  await typeInto(page, "recipient@example.com", "jane.doe@example.com");
  await typeInto(page, "Your name", "Emily Carter");
  await typeInto(page, "Add a personal message", "Happy birthday! Enjoy a little self-care.");
  await sectionShot(page, "24-giftcard-step2-filled", "Gift Details");
  await clickText(page, "Review Gift");
  await sectionShot(page, "25-giftcard-step3-review", "Review Your Gift");
  await clickText(page, "Proceed to Checkout");
  await typeInto(page, "Full name", "Emily Carter");
  await typeInto(page, "you@example.com", "emily.carter@example.com");
  await sectionShot(page, "26-giftcard-step4-checkout", "Checkout");

  console.log("Booking flow");
  await open(page, "/book");
  const firstService = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((el) => el.textContent.includes("Select") && el.querySelector("h3"));
    if (b) b.click();
    return !!b;
  });
  if (!firstService) throw new Error("No bookable service found");
  await wait(1200);
  await sectionShot(page, "27-booking-step2-provider", "Change service");
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((el) => el.textContent.includes("Any Available Provider"))
      || [...document.querySelectorAll("button")].find((el) => el.querySelector("svg") && el.textContent.trim() && el.className.includes("rounded-2xl") && !el.textContent.includes("Change service"));
    b?.click();
  });
  await wait(1200);
  await sectionShot(page, "28-booking-step3-calendar", "Change provider");

  const pickedSlot = await (async () => {
    const dayCount = await page.evaluate(() => [...document.querySelectorAll("button.h-9:not([disabled])")].length);
    for (let i = 0; i < Math.min(dayCount, 14); i++) {
      await page.evaluate((idx) => [...document.querySelectorAll("button.h-9:not([disabled])")][idx].click(), i);
      await wait(1500);
      const hasSlot = await page.evaluate(() => {
        const s = [...document.querySelectorAll("button")].find((el) => /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(el.textContent.trim()));
        if (s) s.click();
        return !!s;
      });
      if (hasSlot) return true;
    }
    return false;
  })();
  await wait(600);
  await sectionShot(page, "29-booking-step3-time", "Change provider");

  if (pickedSlot) {
    await clickText(page, "Continue to Review");
    await typeInto(page, "Your full name", "Emily Carter");
    await typeInto(page, "your@email.com", "emily.carter@example.com");
    await typeInto(page, "(607) 555-1234", "(607) 555-0142");
    await sectionShot(page, "30-booking-step4-details", "Change date/time");
  } else {
    console.log("  No open time slots found — skipped details step");
  }

  await open(page, "/book");
  await clickText(page, "Join the Waitlist");
  await sectionShot(page, "31-booking-waitlist", "Back to services");

  await browser.close();
  console.log("Done:", OUT);
}

run().catch((e) => { console.error(e); process.exit(1); });
