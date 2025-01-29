import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
}));

app.use(express.json({limit: "16Kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes
import userRouter from "./routes/user.routes.js";
import carRouter from './routes/car.routes.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js';
//routes declaration
app.use("/api/v1/user",userRouter);
app.use("/api/v1/car",carRouter);
app.get("/api/docs", (req,res) => {
    res.send("Server is ready.")
})
app.use(errorHandler);

export { app };
