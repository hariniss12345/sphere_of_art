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

//Importing the artist controller from the specified path
import artistCltr from './app/controllers/artist-cltr.js'


// Import the validation schemas for user registration and login
import { userRegisterSchema , userLoginSchema } from './app/validators/user-validation-schema.js'

// Importing the idValidationSchema from the 'validators' directory
import idValidationSchema from './app/validators/id-validation-schema.js'

//Import the validation schemas for customer
import customerValidationSchema from './app/validators/customer-validation-schema.js'

//Import the validation schemas for artist
import artistValidationSchema from './app/validators/artist-validation-schema.js'


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

// POST route for use registration : validates request body and calls the register handler
app.post('/api/users/register',checkSchema(userRegisterSchema), userCltr.register)

// POST route for user login: validates request body and calls the login handler
app.post('/api/users/login', checkSchema(userLoginSchema), userCltr.login);

// GET route for user profile: authenticates the user and retrieves their profile
app.get('/api/users/profile', authenticateUser, userCltr.profile);


// POST route for customers: authenticates the user, validates input and calls the create handler
app.post('/api/customers', authenticateUser, checkSchema(customerValidationSchema), customerCltr.create);

// GET route for customers: authenticates the user, validates input and calls the show handler
app.get('/api/customers/my', authenticateUser, customerCltr.show);

// PUT route for customers: authenticates the user, validates input and calls the update handler
app.put('/api/customers/:id',authenticateUser,checkSchema(idValidationSchema),checkSchema(customerValidationSchema),customerCltr.update)

// DELETE route for customers: authenticates the user,validates input and calls the delete handler
app.delete('/api/customers/:id',authenticateUser,checkSchema(idValidationSchema),customerCltr.delete)


// POST route for artists : authenticates the user,validates input and calls the create method
app.post('/api/artists',authenticateUser,checkSchema(artistValidationSchema),artistCltr.create)

// GET route for artists : authenticates the user and calls the show method
app.get('/api/artists/my',authenticateUser,artistCltr.show)

//PUT route for artists : authenticates the user,validates the input and calls the update method
app.put('/api/artists/:id',authenticateUser,checkSchema(idValidationSchema),checkSchema(artistValidationSchema),artistCltr.update)

//DELETE route for artists : authenticates the user.validates the input and calls the delete method
app.delete('/api/artists/:id',authenticateUser,checkSchema(idValidationSchema),artistCltr.delete)

// Start the server and listen on the port specified in the environment variables
app.listen(process.env.PORT, () => {
    // Log that the server is running successfully and show the port it's listening on
    console.log('Server is running on port', process.env.PORT);
})
