import "reflect-metadata";
import express from 'express';
import AppDataSource from "./database/data-source";
import cookieParser from 'cookie-parser';
import router from "Routes/Root.routes";
import errorHandler from "middlewares/errorHandler";
import { connectRedis } from "modules/Redis/redis.init";
import { serverAdapter } from "modules/BullBoard/Bullboard";
import { emailWorker } from "modules/BullMQ/emai.process";
import cors from 'cors'

console.clear()
const app = express();
const port = 5000;


app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '50kb', extended: true }));
app.use(cookieParser());
app.use('/v1',router)
app.use("/admin/queues", serverAdapter.getRouter()); 
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type'],
    preflightContinue: false,
}));
app.options('*', cors()); 



//test handler
if(process.env.NODE_ENV==='development'){
    app.get("/test-error", (req, res, next) => {
      const error = new Error("node-developemnt:Test Handler Error");
      next(error);
    });
}
app.use((req, res, next) => {
    const err = new Error("Page not found") as any;
    err.statusCode = 404;
    next(err);
});

app.use(errorHandler);

(async () => {
    try {
        // Connect Database
        await AppDataSource.initialize();
        console.log("Database connected successfully! 🚀");
        // Connect Redis
        await connectRedis();
        //TODO: DISABLE TAM THOI DE TRANH SPAM
        //emailWorker

        // Khởi động server
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Initialization failed:", error);
        process.exit(1); // Stop server if can not connect
    }
})();


process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception: ', error);
    process.exit(1)
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection: ', reason);
});


