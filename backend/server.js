const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Custom Logger Middleware
const logger = require('./middleware/loggerMiddleware');
app.use(logger);

const errorHandler = require('./middleware/errorMiddleware');

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/productivity', require('./routes/productivityRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
