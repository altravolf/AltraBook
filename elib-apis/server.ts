import app from "./src/app";
import { config } from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
    try {
        await connectDB()

        const port = config.port ?? 3000;

        app.listen(port, () => {
            console.log(`Server is running on port --> http://localhost:${port}`);
        })
    } catch (e) {
        console.error("Server failed to start", e);
        process.exit(1);
    }
}

startServer();