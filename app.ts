import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerConfig from './config/swagger.config';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

// Swagger setup
const swaggerSpec = swaggerJSDoc(swaggerConfig);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
authRoutes(app);
bookRoutes(app);

// // Product routes with swagger
// app.use(
//   '/api/products',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec),
// );

export default app;