/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId: string
}
const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.header("Authorization");

    if (!token) {
        return next(createHttpError(401, "Access Denied!"));
    }

    try {
        const parsedToken = token.split(" ")[1];
        const decoded = verify(parsedToken, config.jwtToken as string)
        const _req = req as AuthRequest;
        _req.userId = decoded.sub as string;
        next();
    } catch (err) {
        return next(createHttpError(401, "Invalid Or Expired Token!"));
    }

}

export default authenticate;