import app from "./server"; // Link to your server file
import supertest, {Response} from "supertest";

const request = supertest(app);

describe("Test Heath Endpoint", () => {
    it("should return a 200 status and json message", async done => {
        const response: Response = await request.get("/health_check");

        expect(response.status).toEqual(200);
        expect(response.body).toStrictEqual({status: 200});
        done();
    });
});
