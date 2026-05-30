// server/index.js — PHASE 3 REPLACEMENT
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./db');
const socketHandler = require('./socketHandler');
const { csrfProtection } = require('./middleware/csrf');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.disable('x-powered-by');
app.set('trust proxy', 1);
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://nxtconnectapp.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Return false instead of throwing — avoids unhandled error logs
    return callback(null, false);
  },
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use(cookieParser());
app.use(csrfProtection);
app.set('io', io);

// Phase 1
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/roadmaps', require('./routes/roadmaps'));
app.use('/api/chat', require('./routes/chat'));

// Phase 2
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/feed', require('./routes/feed'));
app.use('/api/admin', require('./routes/admin'));

// Phase 3
app.use('/api/ai', require('./routes/ai'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/applications', require('./routes/applications'));

app.get('/', (req, res) => res.json({ message: 'NextConnect API v3 ✅' }));

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
