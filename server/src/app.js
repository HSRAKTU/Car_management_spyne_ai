import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';

const app = express();

// Swagger setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '16Kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import carRouter from './routes/car.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

// API routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/car', carRouter);



// Swagger setup using CDN for assets and a static openapi.json
const setupSwagger = async () => {
  try {
    const openApiPath = path.join(__dirname, '../public/openapi.json'); // Path to the static file
    const openApiData = await readFile(openApiPath, 'utf8'); // Read the file
    const openApiDocument = JSON.parse(openApiData); // Parse JSON

    // Set up Swagger UI with CDN
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, {
      swaggerOptions: {
        url: '../public/openapi.json', // URL to the OpenAPI JSON file
      },
      customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    }));
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
