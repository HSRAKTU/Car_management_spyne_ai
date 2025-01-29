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


import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openApiPath = path.join(__dirname, 'openapi.json');const setupSwagger = async () => {
  try {
    // Read and parse the openapi.json file
    const openApiData = await readFile(openApiPath, 'utf8');
    const openApiDocument = JSON.parse(openApiData);

    // Set up the /api/docs route with Swagger UI
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

    console.log('Swagger UI is available at /api/docs');
  } catch (error) {
    console.error('Error setting up Swagger UI:', error);
  }
};

// Call the setup function
setupSwagger();

app.use(errorHandler);

export { app };
