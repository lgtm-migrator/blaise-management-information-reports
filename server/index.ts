import dotenv from "dotenv";
import { loadConfigFromEnv } from "./Config";
import { newServer } from "./Server";
import BlaiseIapNodeProvider from "blaise-iap-node-provider";
import BlaiseApiClient from "blaise-api-node-client";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/../.env" });
}

const config = loadConfigFromEnv();

const authProvider = new BlaiseIapNodeProvider(config.BertClientId);
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);

const app = newServer(config, authProvider, blaiseApiClient);

const port: string = process.env.PORT || "5004";

app.listen(port);

console.log("App is listening on port " + port);
