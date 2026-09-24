import { NextFunction, Request, Response } from "express";

import config from "../config";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../utils/jwtHelper";
import { StatusCodes } from "http-status-codes";
import ApiError from "../Errors/ApiError";


const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!")
            }

            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt_access_secret as Secret) as NonNullable<Request["user"]>

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!")
            }

            req.user = verifiedUser;
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;