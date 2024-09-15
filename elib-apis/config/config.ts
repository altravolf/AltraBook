import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URI || "mongodb://127.0.0.1:27017/elib"
}


export const config = Object.freeze(_config);