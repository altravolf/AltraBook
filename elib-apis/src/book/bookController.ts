import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import book from "./bookModel";
import { Book } from "./bookTypes";



const createBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { title, author, file } = req.body as Book;

    if (!title || !author || !file) {
        const error = createHttpError(400, "Required All Fields");
        return next(error);
    }

    // const existedBook = await book.findOne({ title });


    const newBook = await book.create(req.body);

    res.json({ message: "OK", body: newBook });
})

export { createBook };