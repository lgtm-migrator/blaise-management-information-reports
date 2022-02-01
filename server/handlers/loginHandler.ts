import BlaiseApiClient, { User } from "blaise-api-node-client";
import express, { Router, Request, Response } from "express";
import { Config } from "../Config";
import jwt from "jsonwebtoken";


export default function newLoginHandler(config: Config, blaiseApiClient: BlaiseApiClient): Router {
  const router = express.Router();

  router.use(express.json());

  const loginHandler = new LoginHandler(config, blaiseApiClient);
  router.get("/api/login/users/:username", loginHandler.GetUser);
  router.get("/api/login/users/:username/authorised", loginHandler.ValidateRoles);
  router.post("/api/login/token/validate", loginHandler.ValidateToken);
  router.post("/api/login/users/password/validate", loginHandler.ValidatePassword);
  return router;
}

export class LoginHandler {
  config: Config
  blaiseApiClient: BlaiseApiClient;

  constructor(config: Config, blaiseApiClient: BlaiseApiClient) {
    this.config = config;
    this.blaiseApiClient = blaiseApiClient;

    this.GetUser = this.GetUser.bind(this);
    this.ValidatePassword = this.ValidatePassword.bind(this);
    this.ValidateRoles = this.ValidateRoles.bind(this);
    this.ValidateToken = this.ValidateToken.bind(this);
  }

  async GetUser(req: Request, res: Response): Promise<Response> {
    console.log("Getting user");
    return res.status(200).json(await this.blaiseApiClient.getUser(req.params.username));
  }

  async ValidatePassword(req: Request, res: Response): Promise<Response> {
    console.log("Validating password");
    const { username, password } = req.body;
    return res.status(200).json(await this.blaiseApiClient.validatePassword(username, password));
  }

  async ValidateRoles(req: Request, res: Response): Promise<Response> {
    console.log("Validating user roles");
    const user = await this.blaiseApiClient.getUser(req.params.username);
    if (this.roleValid(user)) {
      const token = jwt.sign({
        data: user
      }, this.config.SessionSecret, { expiresIn: this.config.SessionTimeout });
      return res.status(200).json({ token: token });
    }

    return res.status(403).json({ "error": "Not authorised" });
  }

  async ValidateToken(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.body.token) {
        return res.status(403).json();
      }
      jwt.verify(req.body.token, this.config.SessionSecret);
    } catch (error: any) {
      console.error(`Invalid JWT token: ${error}`);
      return res.status(403).json();
    }
    return res.status(200).json();
  }

  roleValid(user: User): boolean {
    return this.config.Roles.includes(user.role);
  }
}
