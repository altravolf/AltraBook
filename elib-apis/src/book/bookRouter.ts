import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "path";
const bookRouter = express.Router();

// Set up multer for file uploads
const upload = multer({
    // Specify the destination folder for storing uploads
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    // Limit the file size to 30MB
    limits: { fileSize: 1024 * 1024 * 30 },
})

bookRouter.post(
    "/",
    // Specify the fields to be uploaded: cover image and file
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 }
    ]),
    createBook
);

export default bookRouter;