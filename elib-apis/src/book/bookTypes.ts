import { User } from "../user/userTypes";

export interface Book {
    _id: string;
    title: string;
    author: string;
    description: string;
    admin: User;
    genre: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}