import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {

    forbidOnly: !!process.env.CI,
    retries: Number(process.env.RETRIES) || 0,
    timeout: 300000,
    use: {
        trace: process.env.TRACE ? "on" : "on-first-retry",
        locale: "en-GB",
        actionTimeout: 60000,
    },
    expect: {
        timeout: 30000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        }
    ],
};
export default config;
