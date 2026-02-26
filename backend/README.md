# FitPulse AI Backend

This is the backend for FitPulse AI, built with Express, Mongoose, and Node.js.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Ensure `.env` file exists in the root of `backend` directory with the following variables:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/fitpulse-ai
    JWT_SECRET=your_jwt_secret_key_here
    NODE_ENV=development
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Run Production Server**:
    ```bash
    npm start
    ```

## Folder Structure

- `src/config`: Database configuration
- `src/controllers`: Request handlers
- `src/middlewares`: Custom middlewares
- `src/models`: Mongoose models
- `src/routes`: API endpoints
- `src/services`: Business logic
- `src/utils`: Utility functions
