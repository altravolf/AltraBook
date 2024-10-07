import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URI,
    env: process.env.ENV,
    jwtToken: process.env.JWT_TOKEN,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
}


export const config = Object.freeze(_config);