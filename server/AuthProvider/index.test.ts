import AuthProvider from "./index";
import jwt from "jsonwebtoken";
import getGoogleAuthToken from "./GoogleTokenProvider";

jest.mock("./GoogleTokenProvider");

const mockedGetGoogleAuthToken = getGoogleAuthToken as jest.Mock<Promise<string>>;

function mock_AuthToken(token: string) {
    mockedGetGoogleAuthToken.mockImplementationOnce(() => {
        return Promise.resolve(token);
    });
}

afterEach(() => {
    mockedGetGoogleAuthToken.mockClear();
    jest.clearAllMocks();
    jest.resetAllMocks();
});

it("We can get back auth headers with a token", async () => {
    const uniqueToken = "A Token";
    mock_AuthToken(uniqueToken);
    const googleAuthProvider = new AuthProvider("BERT_CLIENT_ID");
    const authHeader = await googleAuthProvider.getAuthHeader();
    expect(authHeader).toEqual({Authorization: `Bearer ${uniqueToken}`});
    expect(mockedGetGoogleAuthToken).toBeCalledWith("BERT_CLIENT_ID");
});

it("We get a new token when the token has expired", async () => {
    console.log = jest.fn();
    // Setup old token for 30 seconds in the past
    const older_token = jwt.sign({foo: "bar", exp: Math.floor(Date.now() / 1000) - 30}, "shhh");
    mock_AuthToken(older_token);
    const googleAuthProvider = new AuthProvider("BERT_CLIENT_ID");
    await googleAuthProvider.getAuthHeader();
    // Call for header that should have expired now
    const updatedToken = "SecondaryTokenCalled";
    mock_AuthToken(updatedToken);
    const authHeader = await googleAuthProvider.getAuthHeader();
    expect(authHeader).toEqual({Authorization: `Bearer ${updatedToken}`});
    expect(console.log).toHaveBeenCalledWith("Token expired, calling for new token");
});

it("We receive the same token if it hasn't expired", async () => {
    console.log = jest.fn();
    // Setup token for an hour in the future
    const older_token = jwt.sign({foo: "bar", exp: Math.floor(Date.now() / 1000) + (60 * 60)}, "shhh");
    mock_AuthToken(older_token);
    const googleAuthProvider = new AuthProvider("BERT_CLIENT_ID");
    await googleAuthProvider.getAuthHeader();
    // Call for header that should not have expired
    const updatedToken = "SecondaryTokenCalled";
    mock_AuthToken(updatedToken);
    const authHeader = await googleAuthProvider.getAuthHeader();
    // Token should not have been updated
    expect(authHeader).toEqual({Authorization: `Bearer ${older_token}`});
    expect(mockedGetGoogleAuthToken).toHaveBeenCalledTimes(1);
});

it("We get a new token when a token is invalid", async () => {
    console.log = jest.fn();
    // Setup old token which is broken
    mock_AuthToken("%%%%%");
    const googleAuthProvider = new AuthProvider("BERT_CLIENT_ID");
    await googleAuthProvider.getAuthHeader();
    // Call for header again which should update
    const updatedToken = "SecondaryTokenCalled";
    mock_AuthToken(updatedToken);
    const authHeader = await googleAuthProvider.getAuthHeader();
    expect(authHeader).toEqual({Authorization: `Bearer ${updatedToken}`});
    expect(console.log).toHaveBeenCalledWith("Failed to decode token, calling for new token");
});
