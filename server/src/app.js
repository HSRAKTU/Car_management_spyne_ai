import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '16Kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public')); // Serve static files
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import carRouter from './routes/car.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

// API routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/car', carRouter);

// Swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Swagger openapi.json from the public directory
const openApiPath = path.join(__dirname, '../public/openapi.json');
const setupSwagger = async () => {
  try {
    // Read the JSON file using fs/promises
    const openApiData = await readFile(openApiPath, 'utf8');
    const openApiDocument = JSON.parse(openApiData);

    // Set up Swagger UI at /api/docs
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
    console.log('Swagger UI is available at /api/docs');
  } catch (error) {
    console.error('Error setting up Swagger UI:', error);
  }
};

// Base route
app.get('/', (req, res) => {
  res.send('Server is ready');
});

// Call the setupSwagger function
setupSwagger();

// Error handling middleware
app.use(errorHandler);

export { app };
