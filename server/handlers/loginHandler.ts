import BlaiseApiClient, { User } from "blaise-api-node-client";
import express, { Router, Request, Response } from "express";
import { Config } from "../Config";

export interface ValidatedUser extends User {
  rolesValidated: boolean
}

export default function newLoginHandler(config: Config, blaiseApiClient: BlaiseApiClient): Router {
  const router = express.Router();

  const loginHandler = new LoginHandler(config, blaiseApiClient);
  router.get("/api/login/users/:username", loginHandler.GetUser);
  router.get("/api/login/users/:username/authorised", loginHandler.ValidateRoles);
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
    const validatedUser: ValidatedUser = {
      name: user.name,
      role: user.role,
      serverParks: user.serverParks,
      defaultServerPark: user.defaultServerPark,
      rolesValidated: this.roleValid(user)
    };
    return res.status(200).json(validatedUser);
  }

  roleValid(user: User): boolean {
    return this.config.Roles.includes(user.role);
  }
}
