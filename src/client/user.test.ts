import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getUser, validatePassword, validateUserPermissions } from "./user";

const mock = new MockAdapter(axios);

describe("Get user", () => {
  it("returns the user details", async () => {
    mock.onGet("/api/login/users/bob").reply(200, { "role": "test" });

    expect(await getUser("bob")).toEqual({ "role": "test" });
  });
});

describe("Validate password", () => {
  it("returns the user details", async () => {
    mock.onPost("/api/login/users/password/validate").reply(200, true);

    expect(await validatePassword("bob", "bobs-password")).toBeTruthy();
  });
});

describe("Validate user permissions", () => {
  it("returns the user details", async () => {
    mock.onGet("/api/login/users/bob/authorised").reply(200, { "role": "test", "rolesValidated": false });

    expect(await validateUserPermissions("bob")).toEqual({ "role": "test", "rolesValidated": false });
  });
});
