const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const actionItemRoutes = require('./routes/actionItemRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import authentication middleware
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Check current user
app.use(checkUser);

// Authentication routes
app.use('/cry/auth', authRoutes);

// Protected routes
app.use('/cry/projects', requireAuth, projectRoutes);
app.use('/cry/action-items', requireAuth, actionItemRoutes);
app.use('/cry/documents', requireAuth, documentRoutes);
app.use('/cry/notifications', requireAuth, notificationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(process.env.PORT, () => {
            console.log(`Service is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });