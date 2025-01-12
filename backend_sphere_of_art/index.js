// Import the Express framework for building the server
import express from 'express';

// Import the dotenv package to load environment variables from a .env file into process.env
import dotenv from 'dotenv';

// Import the cors package to enable Cross-Origin Resource Sharing (CORS)
import cors from 'cors'

// Import the database configuration function to connect to MongoDB
import configureDB from './config/db.js';

// Import the checkSchema method from express-validator to validate request data
import { checkSchema } from 'express-validator'

// Import the user controller that handles the business logic for user-related operations
import userCltr from './app/controllers/user-cltr.js'

// Import the validation schemas for user registration and login
import { userRegisterSchema , userLoginSchema } from './app/validators/user-validation-schema.js'

// Initialize the Express application
const app = express(); 

// Load environment variables from the .env file
dotenv.config(); 

// Connect to the MongoDB database using the configured function
configureDB(); 

// Use the built-in express.json middleware to parse JSON request bodies
app.use(express.json())

// Enable CORS to allow cross-origin requests
app.use(cors())

// Define the POST route for user registration
// It validates the incoming request body using the userRegisterSchema
// After validation, the register method from the user controller is called
app.post('/api/users/register', checkSchema(userRegisterSchema), userCltr.register)

// Start the server and listen on the port specified in the environment variables
app.listen(process.env.PORT, () => {
    // Log that the server is running successfully and show the port it's listening on
    console.log('Server is running on port', process.env.PORT);
});
