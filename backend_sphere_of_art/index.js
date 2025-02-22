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

//Importing the portfolio controller from the specified path
import portfolioCltr from './app/controllers/portfolio-cltr.js'

//Importing thr art controller from the specified path
import artCltr from './app/controllers/art-cltr.js'

//Importing the order controller from the specified path
import orderCltr from './app/controllers/order-cltr.js'

import paymentCltr from './app/controllers/payment-cltr.js'

import reviewCltr from './app/controllers/review-cltr.js'

// Import the validation schemas for user registration and login
import { userRegisterSchema , userLoginSchema } from './app/validators/user-validation-schema.js'

// Importing the idValidationSchema from the 'validators' directory
import idValidationSchema from './app/validators/id-validation-schema.js'

//Import the validation schemas for customer
import customerValidationSchema from './app/validators/customer-validation-schema.js'

//Import the validation schemas for artist
import artistValidationSchema from './app/validators/artist-validation-schema.js'

//Import the validation schemas for portfolio
import portfolioValidationSchema from './app/validators/portfolio-validation-schema.js'

//Import the validation schemas for art
import artValidationSchema from './app/validators/art-validation-schema.js'

// Import the authenticateUser middleware function to validate the user's JWT and authenticate requests
import authenticateUser from './app/middlewares/authenticate.js';

// Importing the 'upload' middleware from the specified path
// This middleware handles file uploads, using configurations like storage options and file validation.
import upload from './app/middlewares/upload.js';

// Importing the file validation middleware used to validate uploaded files
import fileValidation from './app/middlewares/fileValidation.js';

// Importing the login validation middleware validates the login request data 
import loginValidation from './app/middlewares/loginValidation.js';

import authorizeUser from './app/middlewares/authorize.js'

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

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// POST route for use registration: validates request body and calls the register handler
app.post('/api/users/register',checkSchema(userRegisterSchema), userCltr.register)

// POST route for user login: validates request body and calls the login handler
app.post('/api/users/login',loginValidation,checkSchema(userLoginSchema),userCltr.login);

//POST route for users: users can request a password reset.
app.post('/api/users/forgot-password',userCltr.forgotPassword)

app.post('/api/users/reset-password/:token',userCltr.resetPassword)

// GET route for user profile: authenticates the user and retrieves their profile
app.get('/api/users/profile', authenticateUser, userCltr.profile)


// POST route for customers: authenticates the user, validates input and calls the create handler
app.post('/api/customers', authenticateUser,authorizeUser(['customer']),checkSchema(customerValidationSchema), customerCltr.create);

// GET route for customers: authenticates the user, validates input and calls the show handler
app.get('/api/customers/my', authenticateUser,authorizeUser(['customer']),customerCltr.show);

// PUT route for customers: authenticates the user, validates input and calls the update handler
app.put('/api/customers/:id',authenticateUser,authorizeUser(['customer']),checkSchema(idValidationSchema),checkSchema(customerValidationSchema),customerCltr.update)

// DELETE route for customers: authenticates the user,validates input and calls the delete handler
app.delete('/api/customers/:id',authenticateUser,authorizeUser(['customer']),checkSchema(idValidationSchema),customerCltr.delete)


// POST route for artists: authenticates the user,validates input and calls the create method
app.post('/api/artists',authenticateUser,authorizeUser(['artist']),checkSchema(artistValidationSchema),artistCltr.create)

// GET route for artists: authenticates the user and calls the show method
app.get('/api/artists/:id',artistCltr.show)

app.get('/api/artists',artistCltr.list)

//PUT route for artists: authenticates the user,validates the input and calls the update method
app.put('/api/artists/:id',authenticateUser,authorizeUser(['artist']),checkSchema(idValidationSchema),checkSchema(artistValidationSchema),artistCltr.update)

//DELETE route for artists: authenticates the user.validates the input and calls the delete method
app.delete('/api/artists/:id',authenticateUser,authorizeUser(['artist']),checkSchema(idValidationSchema),artistCltr.delete)


// POST route for portfolio: authenticates the user,handles file upload,validates the input and calls the upload method
app.post('/api/portfolios/upload',authenticateUser,authorizeUser(['artist']),upload.single('image'),checkSchema(portfolioValidationSchema),portfolioCltr.upload)

// GET route for portfolio: authenticates the user,validates the input and calls the show method
app.get('/api/portfolios/:id',authenticateUser,authorizeUser(['artist']),checkSchema(idValidationSchema),portfolioCltr.show)

// GET route for portfolio: authenticates the user,validates the input and calls the list method
app.get('/api/portfolios',authenticateUser,authorizeUser(['artist']),portfolioCltr.list)

// PUT route for portfolio: authenticates the user,validates the input and calls the update method
app.put('/api/portfolios/:id',authenticateUser,authorizeUser(['artist']),upload.single('image'),checkSchema(idValidationSchema),checkSchema(portfolioValidationSchema),portfolioCltr.update)

// DELETE route for portfolio: authenticates the user,validates the input and calls the delete method
app.delete('/api/portfolios/:id',authenticateUser,authorizeUser(['artist']),checkSchema(idValidationSchema),portfolioCltr.delete)

//POST route for art: authenticates the user,handles the file upload,validates the input and calls the create method
app.post('/api/arts/uploads',authenticateUser,authorizeUser(['customer']),upload.array('images',5),fileValidation,artCltr.upload)

// GET route for art: authenticates the user and calls the list method
app.get('/api/arts',authenticateUser,authorizeUser(['customer']),artCltr.list)

//GET route for art:authenticates the user ,validates the id and calls show method
app.get('/api/arts/:id',authenticateUser,authorizeUser(['customer']),checkSchema(idValidationSchema),artCltr.show)

//PUT route for art:authenticates the user,handles the file upload,validates the id and calls the update method
app.put('/api/arts/:artId',authenticateUser,authorizeUser(['customer']),upload.array('images',5),artCltr.update)

//DELETE route for art: authenticates the user,validates the id and calls the delete method
app.delete('/api/arts/:artId',authenticateUser,authorizeUser(['customer']),artCltr.delete)

//DELETE route for image: authenticates the user,validates the id and calls the deleteImage method
app.delete('/api/arts/:artId/image/:imageId',authenticateUser,authorizeUser(['customer']),artCltr.deleteImage)


// POST route for order:authenticate the user,handles uploads,calls middleware and calls the create method
app.post('/api/orders',authenticateUser,authorizeUser(['customer']),upload.array('images',5),fileValidation,orderCltr.create)

//PUT route for order:authenticates the user,calls accept method
app.put('/api/orders/:orderId/artist-action',authenticateUser,authorizeUser(['artist']),orderCltr.artistAction)

//PUT route for oder:authenticates the user,calls confirm method
app.put('/api/orders/:orderId/customer-action',authenticateUser,authorizeUser(['customer']),orderCltr.customerAction)

//GET route for orders:authenticates the user ,calls list method
app.get('/api/orders/artist/:artistId',authenticateUser,authorizeUser(['artist']),orderCltr.listArtist)

//GET route for orders:authenticates the user ,calls list method
app.get('/api/orders/customer/:customerId',authenticateUser,authorizeUser(['customer']),orderCltr.listCustomer)


app.post('/api/payment-intent',authenticateUser,authorizeUser(['customer']),paymentCltr.create)

app.put('/api/payment-confirm',authenticateUser,authorizeUser(['customer']),paymentCltr.confirm)

app.post('/api/reviews',authenticateUser,authorizeUser(['customer']),reviewCltr.create)
app.put('/api/reviews/:id',authenticateUser,authorizeUser(['customer']),reviewCltr.update)
app.get('/api/reviews',authenticateUser,authorizeUser(['artist','customer']),reviewCltr.list)
app.delete('/api/reviews/:id',authenticateUser,authorizeUser(['customer']),reviewCltr.delete)


// Start the server and listen on the port specified in the environment variables
app.listen(process.env.PORT, () => {
    // Log that the server is running successfully and show the port it's listening on
    console.log('Server is running on port', process.env.PORT);
})