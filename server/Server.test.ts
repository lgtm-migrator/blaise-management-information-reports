import { newServer } from "./Server"; // Link to your server file
import supertest, { Response } from "supertest";
import { getEnvironmentVariables } from "./Config";
import AuthProvider from "./AuthProvider";
import BlaiseApiClient from "blaise-api-node-client";

const config = getEnvironmentVariables();
const authProvider = new AuthProvider(config.BERT_CLIENT_ID);
const blaiseApiClient = new BlaiseApiClient(config.BLAISE_API_URL);

const app = newServer(config, authProvider, blaiseApiClient);
const request = supertest(app);

describe("Test Heath Endpoint", () => {
    it("should return a 200 status and json message", async done => {
        const response: Response = await request.get("/mir-ui/version/health");
        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual({ healthy: true });
        done();
    });
});
