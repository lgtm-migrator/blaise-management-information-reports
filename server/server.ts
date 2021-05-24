import express, {NextFunction, Request, Response} from "express";
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
import {getEnvironmentVariables} from "./Config";
import createLogger from "./pino";
import {SendAPIRequest} from "./SendRequest";
import multer from "multer";
const upload = multer();

console.log(__dirname);

if (process.env.NODE_ENV !== "production") {
    dotenv.config({path: __dirname + "/../.env"});
}

const server = express();
const logger = createLogger();
server.use(logger);
server.use(upload.any());
// where ever the react built package is
const buildFolder = "../../build";

// load the .env variables in the server
const {BERT_URL} = getEnvironmentVariables();

// treat the index.html as a template and substitute the values at runtime
//server.set("views", path.join(__dirname, buildFolder));
server.set("views", "/build");
console.log("__dirname, buildFolder: " + path.join(__dirname, buildFolder));
server.engine("html", ejs.renderFile);
//server.use("/static", express.static(path.join(__dirname, `${buildFolder}/static`)));
server.use("/static", express.static("/build/static"));

// Health Check endpoint
server.get("/health_check", async function (req: Request, res: Response) {
    console.log("Heath Check endpoint` called");
    res.status(200).json({status: 200});
});

server.post("/api/reports/interviewer-call-history", async function (req: Request, res: Response) {
    console.log("interviewer-call-history endpoint called");
    logger(req, res);
    console.log(req.body);
    const {interviewer} = req.body;
    const url = `${BERT_URL}/find?interviewer=${interviewer}`;
    const [status, result] = await SendAPIRequest(logger, req, res, url, "GET");
    res.status(status).json(result);
});


server.get("*", function (req: Request, res: Response) {
    res.render("index.html");
});

server.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    logger(req, res);
    req.log.error(err, err.message);
    res.render("/views/500.html", {});
});

export default server;
