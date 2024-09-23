/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();

app.get("/", (req, res, next) => {
    const error = createHttpError(400, "somesh*t gone wrong")
    throw error;

    res.send("Hello world")
})

// Middlewares
app.use(express.json());


// Registering Routers
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);


// Global Error Handler
app.use(globalErrorHandler); // ? We do not call middlewares, express call middleware for us.

export default app;