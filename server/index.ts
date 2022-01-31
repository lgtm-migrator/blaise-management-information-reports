import dotenv from "dotenv";
import { getEnvironmentVariables } from "./Config";
import { newServer } from "./Server";
import AuthProvider from "./AuthProvider";
import BlaiseApiClient from "blaise-api-node-client";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/../.env" });
}


const config = getEnvironmentVariables();

const authProvider = new AuthProvider(config.BERT_CLIENT_ID);
const blaiseApiClient = new BlaiseApiClient(config.BLAISE_API_URL);

const app = newServer(config, authProvider, blaiseApiClient);

const port: string = process.env.PORT || "5004";

app.listen(port);

console.log("App is listening on port " + port);
