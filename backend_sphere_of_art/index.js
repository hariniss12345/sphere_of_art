// Import the Express framework for building the server
import express from 'express';

// Import the dotenv package to load environment variables from a .env file into process.env
import dotenv from 'dotenv';

// Import the database configuration function to connect to MongoDB
import configureDB from './config/db.js';

// Initialize the Express application
const app = express(); 

// Load environment variables from the .env file
dotenv.config(); 

// Connect to the MongoDB database using the configured function
configureDB(); 

// Start the server and listen on the port specified in the environment variables
app.listen(process.env.PORT, () => {
    console.log('Server is running on port', process.env.PORT); // Log that the server has started
});
