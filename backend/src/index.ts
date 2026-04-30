import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

import journalRoutes from './routes/journal';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { query } from './config/db';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to load in browser
}));

// CORS — allow only the frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting — 100 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please slow down.' },
}));

// Upload rate limit — stricter for POST /api/journal
app.use('/api/journal', rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  skip: (req) => req.method !== 'POST',
  message: { success: false, error: 'Upload limit reached. Try again in a minute.' },
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '7d',
  etag: true,
}));

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await query<{ now: Date }>('SELECT NOW() as now');
    res.json({
      success: true,
      status: 'ok',
      db: 'connected',
      dbTime: result.rows[0].now,
      uptime: Math.round(process.uptime()),
    });
  } catch {
    res.status(503).json({ success: false, status: 'db_error' });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n[server] running on http://localhost:${PORT}`);
  console.log(`[server] frontend allowed: ${process.env.FRONTEND_URL}`);
  console.log(`[server] environment: ${process.env.NODE_ENV}\n`);
});

export default app;
