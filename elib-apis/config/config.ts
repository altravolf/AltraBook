import { config as conf } from "dotenv";

conf();

const _config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DB_URI,
    env: process.env.ENV
}


export const config = Object.freeze(_config);