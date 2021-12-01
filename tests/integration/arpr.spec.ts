import { test, expect, Page } from "@playwright/test";
import BlaiseApiClient from "blaise-api-node-client";
import moment from "moment";

const CATI_URL = process.env.CATI_URL;
const CATI_USERNAME = process.env.CATI_USERNAME;
const CATI_PASSWORD = process.env.CATI_PASSWORD || CATI_USERNAME;
const REPORTS_URL = process.env.REPORTS_URL;
const REST_API_URL = process.env.REST_API_URL || "http://localhost:8000";

async function setupInstrument(instrumentName: string) {
  const serverpark = "gusty";
  const blaiseApiClient = new BlaiseApiClient(REST_API_URL);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  await blaiseApiClient.installInstrument(serverpark, {instrumentFile: `${instrumentName}.bpkg`});
  for (let attempts = 0; attempts <= 12; attempts++) {
    const instrumentDetails = await blaiseApiClient.getInstrument(serverpark, instrumentName);
    if (instrumentDetails.status == "Active") {
      break;
    } else {
      console.log(`Instrument ${instrumentName} is not active, waiting to add cases`);
      await new Promise(f => setTimeout(f, 10000));
    }
  }
  for (let caseID = 1; caseID <= 10; caseID++) {
    const caseFields = {
      "qdatabag.telno": "07000 000 000",
      "qdatabag.telno2": "07000 000 000",
      "qdatabag.samptitle": "title",
      "qdatabag.sampfname": "fname",
      "qdatabag.sampsname": "sname",
      "qdatabag.name": "name"
    };
    await blaiseApiClient.addCase(serverpark, instrumentName, caseID.toString(), caseFields);
  }
  await blaiseApiClient.addSurveyDays(serverpark, instrumentName, [today.toISOString(), tomorrow.toISOString()]);
  await blaiseApiClient.addDaybatch(serverpark, instrumentName, {dayBatchDate: today.toISOString(), checkForTreatedCases: false});
}

async function loginCATI(page: Page) {
  await page.goto(`${CATI_URL}/blaise`);
  const loginHeader = page.locator("h1:has-text('Login')");
  if (await loginHeader.isVisible({timeout: 100})) {
    await page.locator("#Username").type(CATI_USERNAME);
    await page.locator("#Password").type(CATI_PASSWORD);
    await page.click("button[type=submit]");
  }
}

async function filterCATIInstrument(page: Page, instrumentName: string) {
  await page.click(".filter-state:has-text('Filters')");
  await page.check(`text=${instrumentName}`);
  await page.click("button:has-text('Apply')");
}

async function setupAppointment(page: Page, instrumentName: string) {
  await loginCATI(page);
  await page.click(".nav li:has-text('Case Info')");
  await filterCATIInstrument(page, instrumentName);
  const [casePage] = await Promise.all([
    page.waitForEvent("popup"),
    await page.click(".glyphicon-calendar >> nth=0"),
  ]);
  await casePage.click(".ParallelButtonComponent:has-text('Appointment')");
  await casePage.click(".CategoryButtonComponent:has-text('Appointment agreed')");
  await casePage.click(".ButtonComponent:has-text('Save and continue')");
  await casePage.locator("table.e-schedule-table").locator("tbody")
    .locator(`//tr/td[@data-date=${tomorrow10am()}]`).click();
  await casePage.click("button:has-text('Confirm')");
  await casePage.click(".ButtonComponent:has-text('Save and continue')");
  await casePage.type(".StringTextBoxComponent", CATI_USERNAME);
  await casePage.click(".ButtonComponent:has-text('Save and continue')");
  await casePage.click(".CategoryButtonComponent >> nth=0");
  await casePage.click(".ButtonComponent:has-text('Save and continue')");
  await casePage.click(".CategoryButtonComponent:has-text('No')");
  await casePage.click(".ButtonComponent:has-text('Save and continue')");
}

async function clearCATIData(page: Page, instrumentName: string) {
  await loginCATI(page);
  await page.click(".nav li:has-text('Surveys')");
  await filterCATIInstrument(page, instrumentName);
  await page.click(".glyphicon-save");
  await page.uncheck("#chkBackupAll");
  await page.click("#chkClearAll");
  await page.click("input[type=submit]:has-text('Execute')", {timeout: 200});
}

function tomorrow10am(): number {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.setHours(10, 0, 0 ,0);
}

function reportTomorrow(): string {
  const tomorrow = moment().add(1, "days");
  return tomorrow.format("dd-mm-yyyy");
}

test.describe("Without data", () => {
  test("I can get to, and run an ARPR for a day with no data", async ({ page }) => {
    await page.goto(`${REPORTS_URL}/`);
    await page.click("#appointment-resource-planning");
    await expect(page.locator("h1")).toHaveText("Run appointment resource planning report");
    await expect(page.locator(".panel--info >> nth=0")).toContainText("Run a Daybatch first to obtain the most accurate results.");
    await page.locator("#date").type("30-06-1990");
    await page.click("button[type=submit]");
    await expect(page.locator(".panel--info >> nth=1")).toHaveText("No data found for parameters given.");
  });
});

test.describe("With data", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(120000);
    const instrumentName = "DST2106Z";
    console.log(`Running ${testInfo.title}`);
    await setupInstrument(instrumentName);
    // CATI seems to be a bit slow on the uptake sometimes...
    await new Promise(f => setTimeout(f, 10000));
    await setupAppointment(page, instrumentName);
  });

  test.afterEach(async ({page}) => {
    const serverpark = "gusty";
    const instrumentName = "DST2106Z";
    const blaiseApiClient = new BlaiseApiClient(REST_API_URL);
    await clearCATIData(page, instrumentName);
    blaiseApiClient.deleteInstrument(serverpark, instrumentName);
  });

  test("I can get to, and run an ARPR for a day with data", async ({ page }) => {
    await page.goto(`${REPORTS_URL}/`);
    await page.click("#appointment-resource-planning");
    await expect(page.locator("h1")).toHaveText("Run appointment resource planning report");
    await expect(page.locator(".panel--info >> nth=0")).toContainText("Run a Daybatch first to obtain the most accurate results.");
    await page.locator("#date").type(`${reportTomorrow}`);
    await page.click("button[type=submit]");
    await expect(page.locator(".panel--info >> nth=1")).toHaveText("No data found for parameters given.");
  });
});
