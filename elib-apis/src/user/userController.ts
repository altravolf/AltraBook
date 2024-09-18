/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import user from "./userModel";
import { User } from "./userTypes";

// ? asyncHandler is used to remove try and catch syntax. It will automatically handle error.
const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    // Checking if all fields are present
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        const error = createHttpError(400, "All field are required!");
        return next(error);
    }

    // Checking if email already exist
    try {
        const lookup = await user.findOne({ email });
        if (lookup) {
            const error = createHttpError(400, "Email already exist!");
            return next(error);
        }
    } catch (err) {
        return next(createHttpError(500, "Error while looking for user's pre-existance in Database."))
    }


    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Creating new User
    let newUser: User;
    try {
        newUser = await user.create({ username, email, password: hashedPassword });
    } catch (err) {
        return next(createHttpError(500, "Error while User is registering!"))
    }

    // Generating JWT (Json Web Token)
    let token: string;
    try {
        token = sign({ sub: newUser._id }, config.jwtToken as string, { expiresIn: "7d" });
    } catch (err) {
        return next(createHttpError(500, "JWT Token Error"))
    }

    // Sending response
    res.json({ message: `User Created Successfully. Id: ${newUser._id} Token: ${token}` })

})


export { createUser };