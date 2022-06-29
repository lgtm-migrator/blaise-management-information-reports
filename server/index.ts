import dotenv from "dotenv";
import { loadConfigFromEnv } from "./Config";
import { newServer } from "./Server";
import BlaiseIapNodeProvider from "blaise-iap-node-provider";
import BlaiseApiClient from "blaise-api-node-client";
import dateFormatter from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Auth } from "blaise-login-react-server";
import customParseFormat from 'dayjs/plugin/customParseFormat'

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/../.env" });
}

dateFormatter.extend(customParseFormat);
dateFormatter.extend(utc);
dateFormatter.extend(timezone);

const config = loadConfigFromEnv();

const authProvider = new BlaiseIapNodeProvider(config.BertClientId);
const blaiseApiClient = new BlaiseApiClient(config.BlaiseApiUrl);
const auth = new Auth(config);


const app = newServer(config, authProvider, auth, blaiseApiClient);

const port: string = process.env.PORT || "5004";

app.listen(port);

console.log("App is listening on port " + port);

