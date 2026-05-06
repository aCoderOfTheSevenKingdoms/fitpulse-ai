const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// ROUTES
const authRoute = require('./src/routes/auth.route');
const userRoute = require('./src/routes/user.route');
const planRoute = require('./src/routes/plan.route');
const progressRoute = require('./src/routes/progress.route');


const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ROUTE MIDDLEWARES
app.use('/api/auth', authRoute);
app.use('/api/plan', planRoute);
app.use('/api/progress', progressRoute);
app.use('/api/user/profile', userRoute);

module.exports = app;