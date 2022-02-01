import express, { NextFunction, Request, Response, Express } from "express";
import path from "path";
import ejs from "ejs";
import createLogger from "./pino";
import { SendAPIRequest } from "./SendRequest";
import multer from "multer";
import dateFormatter from "dayjs";
import BlaiseIapNodeProvider from "blaise-iap-node-provider";
import BlaiseApiClient from "blaise-api-node-client";
import newLoginHandler from "./handlers/loginHandler";
import { Config } from "./Config";

export function newServer(config: Config, authProvider: BlaiseIapNodeProvider, blaiseApiClient: BlaiseApiClient): Express {
    const upload = multer();
    const server = express();
    const logger = createLogger();
    server.use(logger);
    server.use(upload.any());

    // where ever the react built package is
    const buildFolder = "../build";

    // treat the index.html as a template and substitute the values at runtime
    server.set("views", path.join(__dirname, buildFolder));
    server.engine("html", ejs.renderFile);
    server.use("/static", express.static(path.join(__dirname, `${buildFolder}/static`)));

    // health_check endpoint
    server.get("/mir-ui/:version/health", async function (req: Request, res: Response) {
        console.log("health_check endpoint called");
        res.status(200).json({ healthy: true });
    });

    // call-history-status endpoint
    server.get("/api/reports/call-history-status", async function (req: Request, res: Response) {
        console.log("call-history-status endpoint called");
        const authHeader = await authProvider.getAuthHeader();
        logger(req, res);
        const url = `${config.BertUrl}/api/reports/call-history-status`;
        const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
        res.status(status).json(result);
    });

    // interviewer-call-history report endpoint
    server.post("/api/reports/interviewer-call-history", async function (req: Request, res: Response) {
        console.log("interviewer-call-history endpoint called");
        const authHeader = await authProvider.getAuthHeader();
        logger(req, res);
        console.log(req.body);
        const { interviewer, start_date, end_date, survey_tla } = req.body;
        const startDateFormatted = dateFormatter(start_date).format("YYYY-MM-DD");
        const endDateFormatted = dateFormatter(end_date).format("YYYY-MM-DD");
        const url = `${config.BertUrl}/api/reports/call-history/${interviewer}?start-date=${startDateFormatted}&end-date=${endDateFormatted}&survey-tla=${survey_tla}`;
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
        const { interviewer, start_date, end_date, survey_tla } = req.body;
        const startDateFormatted = dateFormatter(start_date).format("YYYY-MM-DD");
        const endDateFormatted = dateFormatter(end_date).format("YYYY-MM-DD");
        const url = `${config.BertUrl}/api/reports/call-pattern/${interviewer}?start-date=${startDateFormatted}&end-date=${endDateFormatted}&survey-tla=${survey_tla}`;
        console.log(url);
        const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
        res.status(status).json(result);
    });

    // appointment-resource-planning report endpoint
    server.post("/api/reports/appointment-resource-planning", async function (req: Request, res: Response) {
        console.log("appointment-resource-planning endpoint called");
        const authHeader = await authProvider.getAuthHeader();
        logger(req, res);
        console.log(req.body);
        const { date } = req.body;
        const dateFormatted = dateFormatter(date).format("YYYY-MM-DD");
        const url = `${config.BertUrl}/api/reports/appointment-resource-planning/${dateFormatted}`;
        console.log(url);
        const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
        res.status(status).json(result);
    });

    // appointment-resource-planning-summary report endpoint
    server.post("/api/reports/appointment-resource-planning-summary", async function (req: Request, res: Response) {
        console.log("appointment-resource-planning-summary endpoint called");
        const authHeader = await authProvider.getAuthHeader();
        logger(req, res);
        console.log(req.body);
        const { date } = req.body;
        const dateFormatted = dateFormatter(date).format("YYYY-MM-DD");
        const url = `${config.BertUrl}/api/reports/appointment-resource-planning-summary/${dateFormatted}`;
        console.log(url);
        const [status, result] = await SendAPIRequest(logger, req, res, url, "GET", null, authHeader);
        res.status(status).json(result);
    });

    const loginHandler = newLoginHandler(config, blaiseApiClient);

    server.use("/", loginHandler);

    server.get("*", function (req: Request, res: Response) {
        res.render("index.html");
    });

    server.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
        logger(req, res);
        req.log.error(err, err.message);
        res.render("../views/500.html", {});
    });

    return server;
}
