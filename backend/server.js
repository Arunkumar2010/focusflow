// FocusFlow Backend - CLEAN VERSION

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// =======================
// MIDDLEWARE
// =======================

// Body parser
app.use(express.json());

// CORS (allow frontend)
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://focusflow-ai-zeta.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

// Logger
const logger = require('./middleware/loggerMiddleware');
app.use(logger);

// =======================
// ROUTES
// =======================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/productivity', require('./routes/productivityRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));

// Health check
app.get('/', (req, res) => {
    res.send('🚀 FocusFlow Backend Running...');
});

// =======================
// ERROR HANDLER
// =======================

const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// =======================
// START SERVER
// =======================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(
        `✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
});

// =======================
// GLOBAL ERROR HANDLING
// =======================

process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});