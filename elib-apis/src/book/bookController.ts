/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import Book from "./bookModel";
import createHttpError from "http-errors";

const createBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    // const { coverImage, file } = req.body;

    const files = req.files as any;

    const coverImageName = files?.coverImage[0].filename;
    const fileName = files?.file[0].filename;

    const coverImagePath = path.resolve(__dirname, `../../public/data/uploads/${coverImageName}`);
    const filePath = path.resolve(__dirname, `../../public/data/uploads/${fileName}`);

    const coverImageUploader = await cloudinary.uploader.upload(coverImagePath, {
        filename_override: coverImageName,
        folder: "book covers",
    })

    const fileUploader = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw",
        filename_override: fileName,
        folder: "book pdfs",
        format: "pdf"
    })

    const newBook = await Book.create({ ...req.body, coverImage: coverImageUploader.secure_url, file: fileUploader.secure_url })

    // Delete files from uploads folder
    try {
        await fs.promises.unlink(coverImagePath);
        await fs.promises.unlink(filePath);
    } catch (err) {
        next(createHttpError(500, "Error while deleting files from uploads folder!"));
    }

    res.json(newBook);
})

export { createBook };