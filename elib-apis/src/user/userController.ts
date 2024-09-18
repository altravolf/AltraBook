/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import user from "./userModel";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { log } from "console";

// ? asyncHandler is used to remove try and catch syntax. It will automatically handle error.
const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        const error = createHttpError(400, "All field are required!");
        return next(error);
    }

    await user.create(req.body);
    res.json({ message: "User Created!" })

})


export { createUser };