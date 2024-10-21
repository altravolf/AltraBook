import mongoose from "mongoose";
import { Book } from "./bookTypes";

const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    genre: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.springshare.com%2F2010%2F02%2F03%2Fno-cover-art-placeholder-images%2F&psig=AOvVaw16PwPwae5Q-Qc8DicnmLmU&ust=1727144415538000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjqhb2A2IgDFQAAAAAdAAAAABAE"
    },
    file: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model<Book>("Book", bookSchema);