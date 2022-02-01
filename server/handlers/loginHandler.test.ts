import supertest, { Response } from "supertest";
import { newServer } from "../Server";

import BlaiseApiClient from "blaise-api-node-client";
import { loadConfigFromEnv } from "../Config";
import AuthProvider from "../AuthProvider";
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
      it("should return a 200 and the user details", async () => {
        mockGetUser.mockImplementation(async () => {
          return Promise.resolve({ "role": "test" });
        });

        const response: Response = await request.get("/api/login/users/bob/authorised");

        expect(response.status).toEqual(200);
        expect(mockGetUser).toHaveBeenCalled();
        expect(response.body).toEqual({ "role": "test", "rolesValidated": false });
      });
    });

    describe("with an valid role", () => {
      it("should return a 200 and the user details", async () => {
        mockGetUser.mockImplementation(async () => {
          return Promise.resolve({ "role": "DST" });
        });

        const response: Response = await request.get("/api/login/users/bob/authorised");

        expect(response.status).toEqual(200);
        expect(mockGetUser).toHaveBeenCalled();
        expect(response.body).toEqual({ "role": "DST", "rolesValidated": true });
      });
    });
  });
});
