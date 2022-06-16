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
const cors = require('cors');

// database
const connectDB = require('./database/connect');
// routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
// middlewares
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const { authenticateUser } = require('./middlewares/auth');

// basic-middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 }
}));
app.use(morgan('tiny'));

// security-middlewares
app.use(cors({
    origin: 'http://localhost:4200',
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// using this middleware now we can access the cookies with req.cookies
// if we use the signed flag we access the cookies with req.signedCookies
// app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the e-commerce-api');
});

app.use('/api/v1/auth', authRoutes);

// middleware that require from every route now on to be authenticated
// app.use(authenticateUser);

app.use('/api/v1/users', authenticateUser, usersRoutes);

app.use('/api/v1/products', productRoutes);

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