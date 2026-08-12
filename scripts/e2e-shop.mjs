import { chromium } from "playwright";

async function dumpConsole(page, label) {
  page.on("pageerror", (err) => console.log(`[${label} PAGEERROR]`, err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[${label} CONSOLE]`, msg.text());
  });
}

async function shopFlow(base, label) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await dumpConsole(page, label);
  const result = { label, base };

  try {
    await page.goto(`${base}/product/exercise-book-192`, { waitUntil: "networkidle" });
    result.productTitle = await page.title();
    await page.getByRole("button", { name: "Add Exercise Book 192 pages to cart" }).first().click();
    await page.waitForTimeout(500);
    await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
    const qtyBefore = await page.locator("span.w-8.text-center").first().textContent();
    result.qtyBefore = qtyBefore?.trim();
    await page.getByRole("button", { name: "Increase quantity" }).first().click();
    await page.waitForTimeout(400);
    const qtyAfterInc = await page.locator("span.w-8.text-center").first().textContent();
    result.qtyAfterInc = qtyAfterInc?.trim();
    await page.getByRole("button", { name: "Decrease quantity" }).first().click();
    await page.waitForTimeout(400);
    const qtyAfterDec = await page.locator("span.w-8.text-center").first().textContent();
    result.qtyAfterDec = qtyAfterDec?.trim();

    await page.getByRole("link", { name: /^Checkout/i }).first().click();
    await page.waitForURL(/\/checkout/, { timeout: 10000 });
    result.checkoutUrl = page.url();

    const nameInput = page.locator('input[name="name"], input[placeholder="Your name"]').first();
    const phoneInput = page.locator('input[name="phone"], input[placeholder="09xx xxx xxx"]').first();
    const addressInput = page
      .locator('input[name="address"], input[placeholder="e.g. Kabulonga, Lusaka"]')
      .first();
    await nameInput.fill("Nathan Test");
    await phoneInput.fill("0977123456");
    await addressInput.fill("Kabulonga");
    result.filledName = await nameInput.inputValue();
    await page.getByRole("button", { name: /Airtel/i }).click();
    await page.getByRole("button", { name: /Place order/i }).first().click();
    await page.waitForTimeout(2500);
    result.checkoutBody = (await page.locator("h1").first().textContent())?.trim();
    result.orderRefVisible = await page.locator("text=/Order GP-/i").count();

    await page.goto(`${base}/profile`, { waitUntil: "networkidle" });
    result.profileH1 = (await page.locator("h1").first().textContent())?.trim();
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForTimeout(400);
    result.afterSignupTab = (await page.locator("h1").first().textContent())?.trim();
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForTimeout(400);
    result.afterSigninTab = (await page.locator("h1").first().textContent())?.trim();

    await page.locator('input[name="identifier"]').fill("gift@gproducts.zm");
    await page.locator('input[name="password"]').fill("changeme123");
    await page.locator('form button[type="submit"]').click();
    await page.waitForTimeout(3500);
    result.afterLoginUrl = page.url();
    result.afterLoginTitle = await page.title();
    result.adminOrError = await page.locator("text=Something went wrong").count();
    result.dashboardHint = await page.locator("text=/Dashboard|Products|Orders|Provider/i").count();
    result.loginErrorText = await page.locator("p.text-red-300, p.text-red-400").first().textContent().catch(() => null);
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(result, null, 2));
  return result;
}

async function main() {
  await shopFlow("http://127.0.0.1:3010", "local");
  await shopFlow("https://www.g-products.store", "live");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
