import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '16Kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public")); // Serve static files
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import carRouter from './routes/car.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import setupSwagger from './utils/swaggersetup.js';

// API routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/car', carRouter);




// Base route
app.get('/', (req, res) => {
  res.send('Server is ready');
});

// Call the setupSwagger function
setupSwagger();

// Error handling middleware
app.use(errorHandler);

export { app };
