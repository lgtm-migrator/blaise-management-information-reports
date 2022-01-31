import BlaiseApiClient from "blaise-api-node-client";
import express, { Router, Request, Response } from "express";

export default function newLoginHandler(blaiseApiClient: BlaiseApiClient): Router {
  const router = express.Router();

  const loginHandler = new LoginHandler(blaiseApiClient);
  router.get("/api/login/users/:username", loginHandler.GetUser);
  router.post("/api/login/users/password/validate", loginHandler.ValidatePassword);
  return router;
}

export class LoginHandler {
  blaiseApiClient: BlaiseApiClient;

  constructor(blaiseApiClient: BlaiseApiClient) {
    this.blaiseApiClient = blaiseApiClient;

    this.GetUser = this.GetUser.bind(this);
    this.ValidatePassword = this.ValidatePassword.bind(this);
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
}
