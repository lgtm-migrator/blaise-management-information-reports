import { expect, test } from "@playwright/test";
import BlaiseApiClient, { NewUser } from "blaise-api-node-client";
import { deleteTestUser, setupQuestionnaire, setupTestUser, unInstallQuestionnaire, } from "./helpers/BlaiseHelpers";
import { setupAppointment, clearCATIData } from "./helpers/CatiHelpers";
import { loginMIR, mirTomorrow } from "./helpers/MirHelpers";

const restApiUrl = process.env.REST_API_URL || "http://localhost:8000";
const restApiClientId = process.env.REST_API_CLIENT_ID || undefined;
const questionnaireName = process.env.TEST_QUESTIONNAIRE;
const serverPark = process.env.SERVER_PARK;
const blaiseApiClient = new BlaiseApiClient(restApiUrl, { blaiseApiClientId: restApiClientId });

let userCredentials: NewUser;

if (!questionnaireName) {
    console.error("Questionnaire name is undefined");
    process.exit(1);
}

if (!serverPark) {
    console.error("Server park is undefined");
    process.exit(1);
}

test.describe("Without data", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Started running before each hook for test ${testInfo.title}`);

        userCredentials = await setupTestUser(blaiseApiClient, serverPark);

        console.log(`Finished running before each hook for test ${testInfo.title}`);
    });

    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Started running after each hook for test ${testInfo.title}`);

        await deleteTestUser(blaiseApiClient, serverPark, userCredentials.name);

        console.log(`Finished running after each hook for test ${testInfo.title}`);
    });

    test("I can get to, and run an ARPR for a day with no data", async ({ page }, testInfo) => {
        console.log(`Started running ${testInfo.title}`);

        await loginMIR(page, userCredentials);

        // Report selection page
        await page.locator("text=Appointment Resource Planning").click();

        // Selection page
        await expect(page.locator("text=Run appointment resource planning report")).toBeVisible();
        await expect(page.locator("text=Run a Daybatch first to obtain the most accurate results.")).toBeVisible();

        await page.locator("#Date").type("30-06-1990");
        await page.locator("text=Next").click();

        // Result page
        await expect(page.locator("text=No questionnaires found for given parameters")).toBeVisible();

        console.log(`Finished running ${testInfo.title}`);
    });
});

test.describe("With data", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Started running before each hook for test ${testInfo.title}`);

        userCredentials = await setupTestUser(blaiseApiClient, serverPark);
        await setupQuestionnaire(blaiseApiClient, questionnaireName, serverPark);
        await setupAppointment(page, questionnaireName, userCredentials);

        console.log(`Finished running before each hook for test ${testInfo.title}`);
    });

    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Started running after each hook for test ${testInfo.title}`);

        await clearCATIData(page, questionnaireName, userCredentials);
        await unInstallQuestionnaire(blaiseApiClient, serverPark, questionnaireName);
        await deleteTestUser(blaiseApiClient, serverPark, userCredentials.name);

        console.log(`Finished running after each hook for test ${testInfo.title}`);
    });

    test("I can get to, and run an ARPR for a day with data", async ({ page }, testInfo) => {
        console.log(`--------------------\nStarted running ${testInfo.title}\n--------------------`);

        await loginMIR(page, userCredentials);

        // Report selection page
        await page.locator("text=Appointment Resource Planning").click();

        // Date selection page
        await expect(page.locator("text=Run appointment resource planning report")).toBeVisible();
        await expect(page.locator("text=Run a Daybatch first to obtain the most accurate results.")).toBeVisible();

        await page.locator("#Date").type(`${mirTomorrow()}`);
        await page.locator("text=Next").click();

        // Questionnaire selection page
        await page.locator(`[type=checkbox][value=${questionnaireName}]`).click();
        await page.locator("text=Run report").click();

        // Report page items
        await expect(page.locator(".table__row:has-text('DST2111Z') >> nth=0 >> td >> nth=1")).toHaveText("10:00");
        await expect(page.locator(".table__row:has-text('DST2111Z') >> nth=0 >> td >> nth=2")).toHaveText("English");
        await expect(page.locator(".table__row:has-text('DST2111Z') >> nth=0 >> td >> nth=3")).toHaveText("1");

        console.log(`Finished running ${testInfo.title}`);
    });
});
