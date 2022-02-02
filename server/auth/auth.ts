import { Config } from "../Config";
import jwt from "jsonwebtoken";
import { User } from "blaise-api-node-client";
import { Request, Response, NextFunction } from "express";

export class Auth {
  config: Config

  constructor(config: Config) {
    this.config = config;
    this.SignToken = this.SignToken.bind(this);
    this.ValidateToken = this.ValidateToken.bind(this);
    this.UserHasRole = this.UserHasRole.bind(this);
    this.Middleware = this.Middleware.bind(this);
  }

  SignToken(user: User): string {
    return jwt.sign({
      user: user
    }, this.config.SessionSecret, { expiresIn: this.config.SessionTimeout });
  }

  ValidateToken(token: string | undefined): boolean {
    if (!token) {
      return false;
    }
    try {
      const decodedToken = jwt.verify(token, this.config.SessionSecret);
      return this.UserHasRole(decodedToken["user"]);
    } catch {
      return false;
    }
  }

  UserHasRole(user: User): boolean {
    return this.config.Roles.includes(user.role);
  }

  async Middleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
    let token = request.get("authorization");
    if (!token) {
      token = request.get("Authorization");
    }
    if (!this.ValidateToken(token)) {
      return response.status(403).json();
    }
    next();
  }
}
