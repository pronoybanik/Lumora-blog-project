import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import config from "../config";
import { jwtHelpers } from "../utils/jwtHelper";

export default function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token) {
    try {
      req.user = jwtHelpers.verifyToken(token, config.jwt_access_secret as Secret) as NonNullable<Request["user"]>;
    } catch {
      // Public blog pages remain readable when a stale token is present.
    }
  }
  next();
}
