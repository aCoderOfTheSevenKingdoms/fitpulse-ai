const dotenv = require('dotenv');
// INJECTING ENV VARIABLES
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/db/connect');

// ROUTES
const authRoute = require('./src/routes/auth.route');
const userRoute = require('./src/routes/user.route');
const planRoute = require('./src/routes/plan.route');
const progressRoute = require('./src/routes/progress.route');

// CONNECT TO THE DB
connectDB();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ROUTE MIDDLEWARES
app.use('/api/auth', authRoute);
app.use('/api/plan', planRoute);
app.use('/api/progress', progressRoute);
app.use('/api/user', userRoute);


// Error Handling Middleware
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
