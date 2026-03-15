require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/auth');
const chatRoutes = require('./src/routes/chat');
const prayerRoutes = require('./src/routes/prayer');
const userRoutes = require('./src/routes/user');

// Connect to MongoDB
connectDB();

const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — allow only your React app to call this server ──────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : 'http://localhost:5173',
    credentials: true
}));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Logging (development only) ────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/user', userRoutes);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Islam101 server is running 🕌', env: process.env.NODE_ENV });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Islam101 server running on http://localhost:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
