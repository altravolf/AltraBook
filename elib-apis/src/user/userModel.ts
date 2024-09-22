import mongoose from "mongoose";
import { User } from "./userTypes";

const { Schema } = mongoose;

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

const user = mongoose.model<User>("User", userSchema);

export default user;