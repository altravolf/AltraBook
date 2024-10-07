import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "path";
const bookRouter = express.Router();

// Set up multer for file uploads with custom storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "../../public/data/uploads")); // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to the filename to avoid name collisions
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit the file size to 10MB
});

// Route for creating a book with cover image and additional file
bookRouter.post(
    "/",
    upload.fields([
        { name: "coverImage", maxCount: 1 },  // Expecting a single file for coverImage
        { name: "file", maxCount: 1 }         // Expecting a single additional file
    ]),
    createBook
);

export default bookRouter;
