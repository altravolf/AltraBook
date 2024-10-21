import express from "express";
import { createBook, updateBook, showBook, singleBook, deleteBook } from "./bookController";
import multer from "multer";
import path from "path";
import authenticate from "../middlewares/authenticate";
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
bookRouter
    // Post request for creating book
    .post(
        "/",
        authenticate,
        upload.fields([
            { name: "coverImage", maxCount: 1 },  // Expecting a single file for coverImage
            { name: "file", maxCount: 1 }         // Expecting a single additional file
        ]),
        createBook)

    // Patch request for updating book 
    .patch("/:bookId/update",
        authenticate,
        upload.fields([
            { name: "coverImage", maxCount: 1 },  // Expecting a single file for coverImage
            { name: "file", maxCount: 1 }         // Expecting a single additional file
        ]),
        updateBook)

    // Get request for showing book list
    .get("/", showBook)

    // Get request for single showing single book
    .get("/:bookId", singleBook)

    // Delete request to delete single book
    .delete("/:bookId", authenticate, deleteBook)

export default bookRouter;
