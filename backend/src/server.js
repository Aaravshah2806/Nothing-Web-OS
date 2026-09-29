import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { supabase } from './config/supabase.js';
import authRoutes from './routes/auth.routes.js';
import desktopRoutes from './routes/desktop.routes.js';
import notesRoutes from './routes/notes.routes.js';
import recorderRoutes from './routes/recorder.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import systemRoutes from './routes/system.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === CLIENT_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Body Parsers (25mb limit supports voice memos)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting (Protects server from spam)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes',
  },
});
app.use('/api', apiLimiter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'NOTHING WEB OS ENGINE',
    version: '1.0.0',
    database: supabase ? 'SUPABASE_CONFIGURED' : 'LOCAL_OFFLINE',
    aiService: process.env.GEMINI_API_KEY ? 'GEMINI_ACTIVE' : (process.env.OPENAI_API_KEY ? 'OPENAI_ACTIVE' : 'SIMULATOR_ACTIVE'),
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/desktop', desktopRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/recorder', recorderRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = () => {
  console.log(`\n===========================================`);
  console.log(`( · ) NOTHING WEB OS - BACKEND ENGINE`);
  console.log(`===========================================`);
  console.log(`[GLYPH DB] Engine: Supabase (PostgreSQL + Auth + Storage)`);
  console.log(`[GLYPH AI] AI Assistant: Ready on /api/ai/chat`);

  app.listen(PORT, () => {
    console.log(`[GLYPH SERVER] Running on: http://localhost:${PORT}`);
    console.log(`[GLYPH SERVER] Health check: http://localhost:${PORT}/api/health\n`);
  });
};

startServer();

export default app;
