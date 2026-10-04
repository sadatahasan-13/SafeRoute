import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { co2 } from '@tgwf/co2';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import routeRoutes from './routes/routeRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
  })
);

// ============================================================================
// Carbon Footprint Tracking Middleware (@tgwf/co2) - Sustainable Web Design
// ============================================================================
const swdEmission = new co2({ model: 'swd' });

app.use((req, res, next) => {
  let requestBytes = 0;
  let responseBytes = 0;

  // Calculate request payload size
  if (req.body && Object.keys(req.body).length > 0) {
    try {
      requestBytes = Buffer.byteLength(JSON.stringify(req.body), 'utf8');
    } catch (e) {
      requestBytes = 0;
    }
  }

  // Intercept response stream to measure total bytes transferred
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8');
    }
    return originalWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8');
    }
    const totalBytes = requestBytes + responseBytes;
    const co2Grams = swdEmission.perByte(totalBytes);
    const co2Mg = (co2Grams * 1000).toFixed(3);

    // Attach carbon metrics to response headers
    res.setHeader('X-Session-Bytes', totalBytes);
    res.setHeader('X-Carbon-Emissions-mg', `${co2Mg} mg`);

    return originalEnd.apply(res, arguments);
  };

  next();
});

// Base / Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SafeRoute Dhaka Night Commute API Server is running.',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: connectDB.isConnected ? 'connected' : 'ready/polling',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);

// 404 & Central Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  SafeRoute Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`  Reports API: http://localhost:${PORT}/api/reports`);
  console.log(`======================================================\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Error]: ${err.message}`);
});

export default app;

