// Packeges
require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload'); 

// rest of the packages
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// security packages
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// --> end of packages

// database
const connectDB = require('./database/connect');

// routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const reviewsRoutes = require('./routes/reviews');
const ordersRoutes = require('./routes/orders');

// middlewares
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const { authenticateUser } = require('./middlewares/auth');

// basic-middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: 'Your file size exceeds the maximum limit'
}));
app.use(morgan('tiny'));

// security-middlewares
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
}));
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:4200',
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(xss());
app.use(mongoSanitize());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the e-commerce-api');
});

app.use('/api/v1/auth', authRoutes);

// middleware that require from every route now on to be authenticated
// app.use(authenticateUser);

app.use('/api/v1/users', authenticateUser, usersRoutes);

app.use('/api/v1/products', productRoutes);

app.use('/api/v1/reviews', reviewsRoutes);

app.use('/api/v1/orders', authenticateUser, ordersRoutes);

// custom middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        console.log('Connected to MONGODB');
        app.listen(port, console.log(`Server listening to: http://localhost:${port}`));
    } catch (err) {
        console.log(err);
    }
};

start();