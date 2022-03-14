import { expect, test } from "@playwright/test";
import BlaiseApiClient, {NewUser} from "blaise-api-node-client";
import { setupInstrument, setupTestUser } from "./helpers/BlaiseHelpers";
import { setupAppointment, clearCATIData } from "./helpers/CatiHelpers";
import { loginMIR, mirTomorrow } from "./helpers/MirHelpers";

const restApiUrl = process.env.REST_API_URL || "http://localhost:8000";
const restApiClientId = process.env.REST_API_CLIENT_ID || undefined;
const instrumentName = process.env.TEST_INSTRUMENT;
const serverPark = process.env.SERVER_PARK;
const blaiseApiClient = new BlaiseApiClient(restApiUrl, { blaiseApiClientId: restApiClientId });

let userCredentials: NewUser;

if (!instrumentName) {
    console.error("Instrument name is undefined");
    process.exit(1);
}

if (!serverPark) {
    console.error("Server park is undefined");
    process.exit(1);
}

test.beforeAll(async () => {
    console.log(`Create a test user on server park ${serverPark}`);
    userCredentials = await setupTestUser(blaiseApiClient, serverPark);
    console.log(`Created test user ${userCredentials.name}`);
});

test.afterAll(async () => {
    console.log(`Attempting to delete test user ${userCredentials.name}`);
    await blaiseApiClient.deleteUser(userCredentials.name);
    console.log(`Deleted test user ${userCredentials.name}`);
});

test.describe("Without data", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        testInfo.setTimeout(200000);
        console.log(`Running ${testInfo.title}`);
    });

    test("I can get to, and run an ARPR for a day with no data", async ({ page }, testInfo) => {
        try {
            await loginMIR(page, userCredentials);
            await page.click("#appointment-resource-planning");

            await expect(page.locator("h1")).toHaveText("Run appointment resource planning report");
            await expect(page.locator(".panel--info >> nth=0")).toContainText("Run a Daybatch first to obtain the most accurate results.");
    
            await page.locator("#date").type("30-06-1990");
            await page.click("button[type=submit]");
    
            await expect(page.locator(".panel--info >> nth=1")).toHaveText("No data found for parameters given.");
        }
        catch (e) {
            console.log(`Test ${testInfo.title} failed: ${e}`);
        }
    });
});

test.describe("With data", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        testInfo.setTimeout(200000);
        console.log(`Running ${testInfo.title}`);

        await setupInstrument(blaiseApiClient, instrumentName, serverPark);
        await setupAppointment(page, instrumentName, userCredentials);
    });

    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Clearing down CATI data for ${testInfo.title}`);
        await clearCATIData(page, instrumentName, userCredentials);
        console.log(`Cleared CATI data for ${testInfo.title}`);

        console.log(`Uninstalling test instrument ${instrumentName}`);
        await blaiseApiClient.deleteInstrument(serverPark, `${instrumentName}`);
        console.log(`Uninstalled test instrument ${instrumentName}`);
    });

    test("I can get to, and run an ARPR for a day with data", async ({ page }, testInfo) => {
        try {
            await loginMIR(page, userCredentials);

            await page.click("#appointment-resource-planning");

            await expect(page.locator("h1")).toHaveText("Run appointment resource planning report");
            await expect(page.locator(".panel--info >> nth=0")).toContainText("Run a Daybatch first to obtain the most accurate results.");

            await page.locator("#date").type(`${mirTomorrow()}`);
            await page.click("button[type=submit]");

            // Report items
            await expect(page.locator(".table__row:has-text('DST2111Z') >> nth=0 >> td >> nth=1")).toHaveText("10:00");
            await expect(page.locator(".table__row:has-text('DST2111Z') >> nth=0 >> td >> nth=2")).toHaveText("English");
            await expect(page.locator(".table__row:has-text('DST2111Z') >> nth=0 >> td >> nth=3")).toHaveText("1");
        }
        catch (e) {
            console.log(`Test ${testInfo.title} failed: ${e}`);
        }
    });
});




