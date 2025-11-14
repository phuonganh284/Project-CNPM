require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool } = require('./config/database');
const { startScheduler, stopScheduler } = require('./jobs/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/authentication');
const booksRoutes = require('./routes/books.routes');
const borrowRequestRoutes = require('./routes/borrowRequest.routes');
const borrowingRoutes = require('./routes/borrowing.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminBookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const copyRoutes = require('./routes/copyRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/borrow-requests', borrowRequestRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/books-admin', adminBookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/copies', copyRoutes);
app.use('/api/users-admin', usersRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test database
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connected!', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`FRONTEND_URL used for CORS: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
    
    // Start background jobs (cron scheduler)
    startScheduler();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    stopScheduler();
    server.close(() => {
      pool.end();
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    stopScheduler();
    server.close(() => {
      pool.end();
      process.exit(0);
    });
  });
}

// Export for testing
module.exports = app;