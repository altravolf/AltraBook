/* eslint-disable no-console */
import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log(`Database connected successfully!`)
        })

        mongoose.connection.on('error', (err) => {
            console.log("Database connected failed in the middle ", err);
        })

        await mongoose.connect(config.dbUrl as string);
    } catch (err) {
        console.error("Database connection failed! ", err);
        process.exit(1);
    }
}



export default connectDB;