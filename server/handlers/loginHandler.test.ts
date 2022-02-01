import supertest, { Response } from "supertest";
import { newServer } from "../Server";

import BlaiseApiClient from "blaise-api-node-client";
import { loadConfigFromEnv } from "../Config";
import AuthProvider from "../AuthProvider";
import jwt from "jsonwebtoken";

const mockGetUser = jest.fn();
const mockValidatePassword = jest.fn();
jest.mock("blaise-api-node-client");
BlaiseApiClient.prototype.getUser = mockGetUser;
BlaiseApiClient.prototype.validatePassword = mockValidatePassword;

const config = loadConfigFromEnv();
const authProvider = new AuthProvider(config.BertClientId);
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

const app = newServer(config, authProvider, blaiseApiClient);
const request = supertest(app);


describe("LoginHandler", () => {
  beforeEach(() => {
    mockGetUser.mockClear();
    mockValidatePassword.mockClear();
  });

  describe("Get user", () => {
    it("should return a 200 and the user details", async () => {
      mockGetUser.mockImplementation(async () => {
        return Promise.resolve({ "role": "test" });
      });

      const response: Response = await request.get("/api/login/users/bob");

      expect(response.status).toEqual(200);
      expect(mockGetUser).toHaveBeenCalled();
      expect(response.body).toEqual({ "role": "test" });
    });
  });

  describe("Validate Password", () => {
    it("should return a 200 and true", async () => {
      mockValidatePassword.mockImplementation(async () => {
        return Promise.resolve(true);
      });

      const response: Response = await request.get("/api/login/users/bob");

      expect(response.status).toEqual(200);
      expect(response.body).toBeTruthy();
    });
  });

  describe("Validate Roles", () => {
    describe("with an invalid role", () => {
      it("should return a 403", async () => {
        mockGetUser.mockImplementation(async () => {
          return Promise.resolve({ "role": "test" });
        });

        const response: Response = await request.get("/api/login/users/bob/authorised");

        expect(response.status).toEqual(403);
        expect(mockGetUser).toHaveBeenCalled();
        expect(response.body).toEqual({ "error": "Not authorised" });
      });
    });

    describe("with an valid role", () => {
      it("should return a 200 and the user details as an encoded jwt", async () => {
        mockGetUser.mockImplementation(async () => {
          return Promise.resolve({ "role": "DST" });
        });

        const response: Response = await request.get("/api/login/users/bob/authorised");

        expect(response.status).toEqual(200);
        expect(mockGetUser).toHaveBeenCalled();
        const myJwt = response.body.token;
        expect(jwt.decode(myJwt)["data"]).toEqual({ "role": "DST" });
      });
    });
  });

  describe("ValidateToken", () => {
    describe("with an invalid token", () => {
      it("should return a 403", async () => {
        const response: Response = await request.post("/api/login/token/validate")
          .send({ token: "not a token and that" })
          .set("Content-Type", "application/json");

        expect(response.status).toEqual(403);
      });
    });

    describe("with a valid token", () => {
      it("should return a 200", async () => {
        const token = jwt.sign("random payload", config.SessionSecret);
        const response: Response = await request.post("/api/login/token/validate")
          .send({ token: token })
          .set("Content-Type", "application/json");

        expect(response.status).toEqual(200);
      });
    });
  });
});
