/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import Book from "./bookModel";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    // const { coverImage, file } = req.body;

    const files = req.files as any;

    const coverImageName = files?.coverImage[0].filename;
    const coverImagePath = path.resolve(__dirname, `../../public/data/uploads/${coverImageName}`);

    const fileName = files?.file[0].filename;
    const filePath = path.resolve(__dirname, `../../public/data/uploads/${fileName}`);

    const coverImageUploader = await cloudinary.uploader.upload(coverImagePath, {
        filename_override: coverImageName,
        folder: "book-covers",
    })

    const fileUploader = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw",
        filename_override: fileName,
        folder: "book-pdfs",
        format: "pdf"
    })

    const _req = req as AuthRequest;

    const newBook = await Book.create({ ...req.body, coverImage: coverImageUploader.secure_url, file: fileUploader.secure_url, admin: _req.userId });

    // Delete files from uploads folder
    try {
        await fs.promises.unlink(coverImagePath);
        await fs.promises.unlink(filePath);
    } catch (err) {
        next(createHttpError(500, "Error while deleting files from uploads folder!"));
    }

    res.json(newBook);
})


const updateBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { bookId } = req.params;

    let book: any;
    try {
        book = await Book.findById(bookId);
        if (!book) {
            return next(createHttpError(404, "Book not found!"));
        }

        const _req = req as AuthRequest;

        if (book.admin.toString() !== _req.userId) {
            return next(createHttpError(403, "Unauthourized User!"));
        }
    } catch (err) {
        return next(createHttpError(400, "Invalid Book Id"));
    }

    const files = req.files as any || {};

    let overrideCoverImage = "";
    if (files?.coverImage) {

        // deleting coverImage from Cloudinary
        const coverImage = book.coverImage.split("/");

        const firstPartCoverImage = coverImage.at(-2);
        const secondPartCoverImage = coverImage.at(-1).split(".").at(0);

        const publicIdCoverImage = firstPartCoverImage + "/" + secondPartCoverImage;
        const delClaudinaryCoverImage = await cloudinary.uploader.destroy(publicIdCoverImage);

        const coverImageName = files?.coverImage[0].filename;

        const coverImagePath = path.resolve(__dirname, `../../public/data/uploads/${coverImageName}`);

        const coverImageUploader = await cloudinary.uploader.upload(coverImagePath, {
            filename_override: coverImageName,
            folder: "book-covers",
        })

        overrideCoverImage = coverImageUploader.secure_url;

        await fs.promises.unlink(coverImagePath);
    }

    let overrideFile = "";
    if (files?.file) {
        // deleting file from Cloudinary
        const file = book.file.split("/");

        const firstPartFile = file.at(-2);
        const secondPartFile = file.at(-1);

        const publicIdFile = firstPartFile + "/" + secondPartFile;
        const delClaudinaryFile = await cloudinary.uploader.destroy(publicIdFile);

        const fileName = files?.file[0].filename;

        const filePath = path.resolve(__dirname, `../../public/data/uploads/${fileName}`);

        const fileUploader = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "book-pdfs",
            resource_type: "raw",
            format: "pdf"
        })

        overrideFile = fileUploader.secure_url;

        await fs.promises.unlink(filePath);
    }

    const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, {
        coverImage: overrideCoverImage || book.coverImage,
        file: overrideFile || book.file,
        title: req.body.title || book.title,
        author: req.body.author || book.author,
        description: req.body.description || book.description,
        genre: req.body.genre || book.genre,
    }, {
        new: true
    })

    res.json({
        updatedBook
    })
})


const showBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bookList = await Book.find({});

    res.json({ bookList });
})

const singleBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { bookId } = req.params;

    let findBook: any;
    try {
        findBook = await Book.findById(bookId);

        if (!findBook) {
            return next(createHttpError(404, "Book not found!"))
        }
    } catch (err) {
        return next(createHttpError(400, "Wrong Book Id!"))
    }

    res.json({ findBook })
})

const deleteBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;

    let delBook: any;
    try {
        delBook = await Book.findByIdAndDelete(bookId);

        if (!delBook) {
            return next(createHttpError(404, "Book not found!"));
        }
        const _req = req as AuthRequest;

        if (delBook.admin.toString() !== _req.userId) {
            return next(createHttpError(401, "Access Denied!"))
        }

    } catch (err) {
        return next(createHttpError(500, "Error while deleting, try again!"));
    }

    // deleting coverImage from Cloudinary
    const coverImage = delBook.coverImage.split("/");

    const firstPartCoverImage = coverImage.at(-2);
    const secondPartCoverImage = coverImage.at(-1).split(".").at(0);

    const publicIdCoverImage = firstPartCoverImage + "/" + secondPartCoverImage;
    const delClaudinaryCoverImage = await cloudinary.uploader.destroy(publicIdCoverImage);

    // deleting file from Cloudinary
    const file = delBook.file.split("/");

    const firstPartFile = file.at(-2);
    const secondPartFile = file.at(-1);

    const publicIdFile = firstPartFile + "/" + secondPartFile;
    const delClaudinaryFile = await cloudinary.uploader.destroy(publicIdFile);

    res.json({
        message: `Book deleted: ${bookId}`
    }).status(204);


})

export { createBook, updateBook, showBook, singleBook, deleteBook };