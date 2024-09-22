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
        const error = createHttpError(500, "Error while looking for user's pre-existance in Database.");
        return next(error);
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
    // ? Status code 201 when something is created for example user is createds
    res.status(201).json({ message: `User Created Successfully. Id: ${newUser._id} Token: ${token}` })

})


const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check all fields are provided by user
    if (!email || !password) {
        const error = createHttpError(400, "All field are required!");
        // If any of the field is missing then send error 
        return next(error);
    }

    // ! Code is working without try and catch but with try catch it shows error.
    // Search for user in database with provided email
    const existingUser = await user.findOne({ email });
    // If user is not found then send error
    if (!existingUser) {
        return next(createHttpError(404, "Your Account is not found!"));
    }

    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, (existingUser as User).password);
    // If password does not match then send error
    if (!isMatch) {
        return next(createHttpError(400, "Wrong Email or Password!"));
    }

    // Generate JWT token for user
    let jwtToken: string;
    try {
        jwtToken = sign({ sub: existingUser._id }, config.jwtToken as string, { expiresIn: "7d" });
    } catch (err) {
        // If there is an error while generating token then send error
        return next(createHttpError(500, "Error while generating Token"));
    }

    // Send response with JWT token
    res.json({ message: `User Logged In. ID: ${jwtToken}` })


})


export { createUser, loginUser };