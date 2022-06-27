import { Page } from "@playwright/test";
import { NewUser } from "blaise-api-node-client";

const CATI_URL = process.env.CATI_URL;

export async function setupAppointment(page: Page, questionnaireName: string, userCredentials: NewUser): Promise<void> {
    console.log(`Attempting to set up an appointment for questionnaire ${questionnaireName}`);

    await loginCATI(page, userCredentials);
    await page.locator("text=Case Info").click();
    await filterCATIQuestionnaire(page, questionnaireName);

    await page.waitForSelector(`tr:has-text('${questionnaireName}') .glyphicon-calendar`);

    const [casePage] = await Promise.all([
        page.waitForEvent("popup"),
        page.locator(`tr:has-text('${questionnaireName}') .glyphicon-calendar`).first().click(),
    ]);
    await casePage.locator("input:left-of(.CategoryButtonComponent:has-text('Appointment agreed'))").first().check();
    await casePage.locator(".ButtonComponent:has-text('Save and continue')").click();
    await casePage.locator("table.e-schedule-table").locator("tbody")
        .locator(`//tr/td[@data-date=${catiTomorrow10am()}]`).click();
    await casePage.locator("button:has-text('Confirm')").click();
    await casePage.locator(".ButtonComponent:has-text('Save and continue')").click();
    await casePage.locator(".StringTextBoxComponent").first().type(`${userCredentials.name}`);
    await casePage.locator(".ButtonComponent:has-text('Save and continue')").click();
    await casePage.locator(".CategoryButtonComponent >> nth=0").click();
    await casePage.locator(".ButtonComponent:has-text('Save and continue')").click();
    await casePage.locator("input:left-of(.CategoryButtonComponent:has-text('No'))").first().check();
    await casePage.locator(".ButtonComponent:has-text('Save and continue')").click();

    console.log(`Set up an appointment for questionnaire ${questionnaireName}`);
}

export async function clearCATIData(page: Page, questionnaireName: string, userCredentials: NewUser): Promise<void> {
    try {
        console.log(`Attempting to clear down CATI data for questionnaire ${questionnaireName}`);

        await loginCATI(page, userCredentials);
        await page.locator(".nav li:has-text('Surveys')").isVisible({ timeout: 1000 });
        await page.locator(".nav li:has-text('Surveys')").click();
        await filterCATIQuestionnaire(page, questionnaireName);
        await page.locator(".glyphicon-save").click();
        await page.locator("#chkBackupAll").uncheck();
        await page.locator("#BackupDaybatch").uncheck();
        await page.locator("#BackupCaseInfo").uncheck();
        await page.locator("#BackupDialHistory").uncheck();
        await page.locator("#BackupEvents").uncheck();
        await page.locator("#chkClearAll").click();
        await page.locator("input[type=submit]:has-text('Execute')").click({ timeout: 20000 });

        console.log(`Cleared CATI data for ${questionnaireName}`);
    }
    catch (error) {
        console.log(`Error clearing down CATI data: ${error}`);
    }
}

async function loginCATI(page: Page, userCredentials: NewUser) {
    await page.goto(`${CATI_URL}/blaise`);
    const loginHeader = page.locator("h1:has-text('Login')");
    if (await loginHeader.isVisible({ timeout: 20000 })) {
        await page.locator("#Username").type(`${userCredentials.name}`);
        await page.locator("#Password").type(`${userCredentials.password}`);
        await page.locator("button:has-text('Login')").click();
    }
}

async function filterCATIQuestionnaire(page: Page, questionnaireName: string) {
    await page.waitForSelector("#MVCGrid_Loading_CaseInfoGrid", { state: "hidden" });
    await page.locator(".filter-state:has-text('Filters')").click();
    const instrumentCheckbox = page.locator(`label:has-text('${questionnaireName}')`);
    if (!await instrumentCheckbox.isChecked()) {
        await instrumentCheckbox.click();
    }
    await page.locator("button:has-text('Apply')").click();
    await page.waitForSelector("#MVCGrid_Loading_CaseInfoGrid", { state: "hidden" });
}

function catiTomorrow10am(): number {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.setHours(10, 0, 0, 0);
}
