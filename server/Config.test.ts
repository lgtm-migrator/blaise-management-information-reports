import {getEnvironmentVariables} from "./Config";

describe("Config setup", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });


    it("should return the correct environment variables", () => {
        const {PROJECT_ID, ENV_NAME, GIT_BRANCH} = getEnvironmentVariables();

        expect(PROJECT_ID).toBe("a-project-name");
        expect(ENV_NAME).toBe("mock-env");
        expect(GIT_BRANCH).toBe("mock-branch");
    });

    it("should return variables with default string if variables are not defined", () => {
        process.env = Object.assign({
            PROJECT_ID: undefined,
            ENV_NAME: undefined,
            GIT_BRANCH: undefined,
        });

        const {PROJECT_ID, ENV_NAME, GIT_BRANCH} = getEnvironmentVariables();

        expect(PROJECT_ID).toBe("ENV_VAR_NOT_SET");
        expect(ENV_NAME).toBe("ENV_VAR_NOT_SET");
        expect(GIT_BRANCH).toBe("ENV_VAR_NOT_SET");
    });
});
