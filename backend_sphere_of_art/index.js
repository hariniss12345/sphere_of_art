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

// Importing the customer controller from the specified path
import customerCltr from './app/controllers/customer-cltr.js';

// Import the validation schemas for user registration and login
import { userRegisterSchema , userLoginSchema } from './app/validators/user-validation-schema.js'

//Import the validation schemas for customer
import customerValidationSchema from './app/validators/customer-validation-schema.js'

// Import the authenticateUser middleware function to validate the user's JWT and authenticate requests
import authenticateUser from './app/middlewares/authenticate.js';


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

// Define a POST route for user login
// It validates the incoming request body using the userLoginSchema
// After validation, the login method from the user controller is called
app.post('/api/users/login',checkSchema(userLoginSchema),userCltr.login)

// Define a GET route for retrieving the user profile
// The authenticateUser middleware is used to validate the JWT token before accessing the profile data
// Once authenticated, the profile method from the userCltr controller is called to handle the response
app.get('/api/users/profile',authenticateUser,userCltr.profile)

// POST request to create a customer
// Authenticates user, validates input, and calls the create method.
app.post('/api/users/customer',authenticateUser,checkSchema(customerValidationSchema),customerCltr.create)

// Start the server and listen on the port specified in the environment variables
app.listen(process.env.PORT, () => {
    // Log that the server is running successfully and show the port it's listening on
    console.log('Server is running on port', process.env.PORT);
});
