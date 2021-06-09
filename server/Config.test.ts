import {getEnvironmentVariables} from "./Config";

describe("Config setup", () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should return the correct environment variables", () => {
        const {PROJECT_ID, BERT_URL, BERT_CLIENT_ID} = getEnvironmentVariables();

        expect(PROJECT_ID).toBe("mock-project-id");
        expect(BERT_URL).toBe("mock-bert-url");
        expect(BERT_CLIENT_ID).toBe("mock-bert-client-id");
    });

    it("should return variables with default string if variables are not defined", () => {
        process.env = Object.assign({
            PROJECT_ID: undefined,
            BERT_URL: undefined,
            BERT_CLIENT_ID: undefined,
        });

        const {PROJECT_ID, BERT_URL, BERT_CLIENT_ID} = getEnvironmentVariables();

        expect(PROJECT_ID).toBe("ENV_VAR_NOT_SET");
        expect(BERT_URL).toBe("ENV_VAR_NOT_SET");
        expect(BERT_CLIENT_ID).toBe("ENV_VAR_NOT_SET");
    });
});
