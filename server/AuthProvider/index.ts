import jwt from "jsonwebtoken";
import getGoogleAuthToken from "./GoogleTokenProvider";

export default class AuthProvider {
    private readonly BERT_CLIENT_ID: string;
    private token: string;

    constructor(BERT_CLIENT_ID: string) {
        this.BERT_CLIENT_ID = BERT_CLIENT_ID;
        this.token = "";
    }

    async getAuthHeader(): Promise<{ Authorization: string }> {
        if (!this.isValidToken()) {
            this.token = await getGoogleAuthToken(this.BERT_CLIENT_ID);
        }
        return {Authorization: `Bearer ${this.token}`};
    }

    private isValidToken(): boolean {
        if (this.token === "") {
            return false;
        }
        const decodedToken = jwt.decode(this.token, {json: true});
        if (decodedToken === null) {
            console.log("Failed to decode token, calling for new token");
            return false;
        } else if (AuthProvider.hasTokenExpired(decodedToken["exp"])) {
            console.log("Token expired, calling for new token");

            return false;
        }

        return true;
    }

    private static hasTokenExpired(expireTimestamp: number): boolean {
        return expireTimestamp < Math.floor(new Date().getTime() / 1000);
    }
}
