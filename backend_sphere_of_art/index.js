// Import packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { checkSchema } from 'express-validator';

// Import configuration, controllers, validators, and middleware
import configureDB from './config/db.js';
import userCltr from './app/controllers/user-cltr.js';
import customerCltr from './app/controllers/customer-cltr.js';
import artistCltr from './app/controllers/artist-cltr.js';
import portfolioCltr from './app/controllers/portfolio-cltr.js';
import artCltr from './app/controllers/art-cltr.js';
import orderCltr from './app/controllers/order-cltr.js';
import paymentCltr from './app/controllers/payment-cltr.js';
import reviewCltr from './app/controllers/review-cltr.js';
import chatCltr from './app/controllers/chat-cltr.js';

import { userRegisterSchema , userLoginSchema } from './app/validators/user-validation-schema.js';
import idValidationSchema from './app/validators/id-validation-schema.js';
import customerValidationSchema from './app/validators/customer-validation-schema.js';
import artistValidationSchema from './app/validators/artist-validation-schema.js';
import portfolioValidationSchema from './app/validators/portfolio-validation-schema.js';
import artValidationSchema from './app/validators/art-validation-schema.js';

import authenticateUser from './app/middlewares/authenticate.js';
import upload from './app/middlewares/upload.js';
import fileValidation from './app/middlewares/fileValidation.js';
import loginValidation from './app/middlewares/loginValidation.js';
import authorizeUser from './app/middlewares/authorize.js';

// Import the chat module from the socket folder
import initChat from './app/socket/chatSocket.js';

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Connect to MongoDB
configureDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Define your routes
app.post('/api/users/register', checkSchema(userRegisterSchema), userCltr.register);
app.post('/api/users/login', loginValidation, checkSchema(userLoginSchema), userCltr.login);
app.post('/api/users/forgot-password', userCltr.forgotPassword);
app.post('/api/users/reset-password/:token', userCltr.resetPassword);
app.get('/api/users/profile', authenticateUser, userCltr.profile);

app.post('/api/customers', authenticateUser, authorizeUser(['customer']), checkSchema(customerValidationSchema), customerCltr.create);
app.get('/api/customers/my', authenticateUser, authorizeUser(['customer']), customerCltr.show);
app.put('/api/customers/:id', authenticateUser, authorizeUser(['customer']), checkSchema(idValidationSchema), checkSchema(customerValidationSchema), customerCltr.update);
app.delete('/api/customers/:id', authenticateUser, authorizeUser(['customer']), checkSchema(idValidationSchema), customerCltr.delete);

app.post('/api/artists', authenticateUser, authorizeUser(['artist']), checkSchema(artistValidationSchema), artistCltr.create);
app.get('/api/artists/:id', artistCltr.show);
app.get('/api/artists', artistCltr.list);
app.put('/api/artists/:id', authenticateUser, authorizeUser(['artist']), checkSchema(idValidationSchema), checkSchema(artistValidationSchema), artistCltr.update);
app.delete('/api/artists/:id', authenticateUser, authorizeUser(['artist']), checkSchema(idValidationSchema), artistCltr.delete);

app.post('/api/portfolios/upload', authenticateUser, authorizeUser(['artist']), upload.single('image'), checkSchema(portfolioValidationSchema), portfolioCltr.upload);
app.get('/api/portfolios/:id', authenticateUser, authorizeUser(['artist']), checkSchema(idValidationSchema), portfolioCltr.show);
app.get('/api/portfolios', authenticateUser, authorizeUser(['artist']), portfolioCltr.list);
app.put('/api/portfolios/:id', authenticateUser, authorizeUser(['artist']), upload.single('image'), checkSchema(idValidationSchema), checkSchema(portfolioValidationSchema), portfolioCltr.update);
app.delete('/api/portfolios/:id', authenticateUser, authorizeUser(['artist']), checkSchema(idValidationSchema), portfolioCltr.delete);

app.post('/api/arts/uploads', authenticateUser, authorizeUser(['customer']), upload.array('images', 5), fileValidation, artCltr.upload);
app.get('/api/arts', authenticateUser, authorizeUser(['customer']), artCltr.list);
app.get('/api/arts/:id', authenticateUser, authorizeUser(['customer']), checkSchema(idValidationSchema), artCltr.show);
app.put('/api/arts/:artId', authenticateUser, authorizeUser(['customer']), upload.array('images', 5), artCltr.update);
app.delete('/api/arts/:artId', authenticateUser, authorizeUser(['customer']), checkSchema(idValidationSchema), artCltr.delete);
app.delete('/api/arts/:artId/image/:imageId', authenticateUser, authorizeUser(['customer']), artCltr.deleteImage);

app.post('/api/orders', authenticateUser, authorizeUser(['customer']), upload.array('images', 5), fileValidation, orderCltr.create);
app.put('/api/orders/:orderId/artist-action', authenticateUser, authorizeUser(['artist']), orderCltr.artistAction);
app.put('/api/orders/:orderId/customer-action', authenticateUser, authorizeUser(['customer']), orderCltr.customerAction);
app.get('/api/orders/artist/:artistId', authenticateUser, authorizeUser(['artist']), orderCltr.listArtist);
app.get('/api/orders/customer/:customerId', authenticateUser, authorizeUser(['customer']), orderCltr.listCustomer);

app.post('/api/payment-intent', authenticateUser, authorizeUser(['customer']), paymentCltr.create);
app.put('/api/payment-confirm', authenticateUser, authorizeUser(['customer']), paymentCltr.confirm);

app.post('/api/reviews', authenticateUser, authorizeUser(['customer']), reviewCltr.create);
app.put('/api/reviews/:id', authenticateUser, authorizeUser(['customer']), reviewCltr.update);
app.get('/api/reviews/artist/:artistId',authenticateUser,authorizeUser(['artist']),reviewCltr.artistReviews)
app.get('/api/reviews/customer/:customerId', authenticateUser, authorizeUser(['customer']), reviewCltr.customerReviews)
app.delete('/api/reviews/:id', authenticateUser, authorizeUser(['customer']), reviewCltr.delete);

app.get('/api/chats/:orderId',authenticateUser,authorizeUser(['artist','customer']),chatCltr.list)
app.put('/api/chats/:chatId',authenticateUser,authorizeUser(['artist','customer']),chatCltr.update)

// ---------------------
// Set Up Socket.IO
// ---------------------

// Create an HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.IO on the HTTP server
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Initialize chat functionality with Socket.IO
initChat(io);

// ---------------------
// Start the Server
// ---------------------

const PORT = process.env.PORT || 4800;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
