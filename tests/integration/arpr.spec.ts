import { test, expect } from "@playwright/test";

const CATI_URL = process.env.CATI_URL;
const CATI_USERNAME = process.env.CATI_USERNAME;
const CATI_PASSWORD = process.env.CATI_PASSWORD || CATI_USERNAME;
const REPORTS_URL = process.env.REPORTS_URL;

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto(`${CATI_URL}/blaise`);
  await page.locator("#Username").type(CATI_USERNAME);
  await page.locator("#Password").type(CATI_PASSWORD);
  await page.click("button[type=submit]");
  await page.click(".nav li:has-text('Appointment')");
});

test("I can get to, and run an ARPR for a day with no data", async ({ page }) => {
  await page.goto(`${REPORTS_URL}/`);
  await page.click("#appointment-resource-planning");
  await expect(page.locator("h1")).toHaveText("Run appointment resource planning report");
  await expect(page.locator(".panel--info >> nth=0")).toContainText("Run a Daybatch first to obtain the most accurate results.");
  await page.locator("#date").type("30-06-1990");
  await page.click("button[type=submit]");
  await expect(page.locator(".panel--info >> nth=1")).toHaveText("No data found for parameters given.");
});
