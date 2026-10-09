const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
const courses = require('./routes/courseRoutes');
const assignments = require('./routes/assignmentRoutes');
const chapters = require('./routes/chapterRoutes');
const messages = require('./routes/messageRoutes');
const stripe = require('./routes/stripeRoutes');
const chapa = require('./routes/chapaRoutes');
const books = require('./routes/bookRoutes');
const uploads = require('./routes/uploadRoutes');
const liveEvents = require('./routes/liveEventRoutes');
const blogs = require('./routes/blogRoutes');
const sermons = require('./routes/sermonRoutes');

const app = express();

// Enable CORS
const allowedOrigins = [
  'https://hamre-wengel.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3500',
  'http://127.0.0.1:3500',
];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

// Mount Stripe/Chapa routes BEFORE express.json() to handle raw body for webhooks
app.use('/api/v1/stripe', stripe);
app.use('/api/v1/chapa', chapa);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/courses', courses);
app.use('/api/v1/assignments', assignments);
app.use('/api/v1/chapters', chapters);
app.use('/api/v1/messages', messages);
app.use('/api/v1/books', books);
app.use('/api/v1/upload', uploads);
app.use('/api/v1/live-events', liveEvents);
app.use('/api/v1/blogs', blogs);
app.use('/api/v1/sermons', sermons);

// Static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error handler
app.use(errorHandler);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the LMS API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
