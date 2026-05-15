const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const initSocket = require('./socket/index.js');

const authRoutes = require('./routes/auth.js');
const pollRoutes = require('./routes/polls.js');
const publicRoutes = require('./routes/public.js');
const analyticsRoutes = require('./routes/analytics.js');

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pollflow')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const io = initSocket(httpServer);
app.set('io', io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
