import express, {NextFunction, Request, Response} from "express";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
import {getEnvironmentVariables} from "./Config";
import createLogger from "./pino";
import {SendAPIRequest} from "./SendRequest";
import multer from "multer";
import dateFormatter from "dayjs";
import AuthProvider from "./AuthProvider";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({path: __dirname + "/../.env"});
}

const upload = multer();
const server = express();
const logger = createLogger();
server.use(logger);
server.use(upload.any());

// where ever the react built package is
const buildFolder = "../build";

// load the .env variables in the server
const {BERT_URL, BERT_CLIENT_ID} = getEnvironmentVariables();

const authProvider = new AuthProvider(BERT_CLIENT_ID);

// treat the index.html as a template and substitute the values at runtime
server.set("views", path.join(__dirname, buildFolder));
server.engine("html", ejs.renderFile);
server.use("/static", express.static(path.join(__dirname, `${buildFolder}/static`)));

// health_check endpoint
server.get("/health_check", async function (req: Request, res: Response) {
    console.log("health_check endpoint` called");
    res.status(200).json({status: 200});
});

// call-history-status endpoint
server.get("/api/reports/call-history-status", async function (req: Request, res: Response) {
    console.log("call-history-status endpoint called");
    const authHeader = await authProvider.getAuthHeader();
    logger(req, res);
    const url = `${BERT_URL}/api/reports/call-history-status`;
    const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
    res.status(status).json(result);
});

// interviewer-call-history report endpoint
server.post("/api/reports/interviewer-call-history", async function (req: Request, res: Response) {
    console.log("interviewer-call-history endpoint called");
    const authHeader = await authProvider.getAuthHeader();
    logger(req, res);
    console.log(req.body);
    const {interviewer, start_date, end_date} = req.body;
    const startDateFormatted = dateFormatter(start_date).format("YYYY-MM-DD");
    const endDateFormatted = dateFormatter(end_date).format("YYYY-MM-DD");
    const url = `${BERT_URL}/api/reports/call-history/${interviewer}?start-date=${startDateFormatted}&end-date=${endDateFormatted}`;
    console.log(url);
    const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
    res.status(status).json(result);
});

// interviewer-call-pattern report endpoint
server.post("/api/reports/interviewer-call-pattern", async function (req: Request, res: Response) {
    console.log("interviewer-call-pattern endpoint called");
    const authHeader = await authProvider.getAuthHeader();
    logger(req, res);
    console.log(req.body);
    const {interviewer, start_date, end_date} = req.body;
    const startDateFormatted = dateFormatter(start_date).format("YYYY-MM-DD");
    const endDateFormatted = dateFormatter(end_date).format("YYYY-MM-DD");
    const url = `${BERT_URL}/api/reports/call-pattern/${interviewer}?start-date=${startDateFormatted}&end-date=${endDateFormatted}`;
    console.log(url);
    const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
    res.status(status).json(result);
});

server.get("*", function (req: Request, res: Response) {
    res.render("index.html");
});

server.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    logger(req, res);
    req.log.error(err, err.message);
    res.render("../views/500.html", {});
});

export default server;
