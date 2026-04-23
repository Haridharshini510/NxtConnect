// server/index.js — PHASE 3 REPLACEMENT
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const socketHandler = require('./socketHandler');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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