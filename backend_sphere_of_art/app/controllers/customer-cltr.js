// Import the Customer model to interact with the customers collection in the database
import Customer from '../models/customer-model.js';

// Import the validationResult function from express-validator to handle validation errors
import { validationResult } from 'express-validator';

// Initialize an empty object to hold the customer-related controller methods
const customerCltr = {};

// Define the create method to handle customer creation requests
customerCltr.create = async (req, res) => {
    // Check if there are validation errors from the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation errors exist, return a 400 response with the error details
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Extract the request body
        const body = req.body;

        // Create a new Customer instance using the request body data
        const newCustomer = new Customer(body);

        // Save the new customer to the database
        const savedCustomer = await newCustomer.save();

        // Return the saved customer data in a 201 response
        res.status(201).json(savedCustomer);
    } catch (err) {
        // Log any errors that occur during the process
        console.log(err.message);

        // Return a 500 response indicating a server-side error
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Export the customer controller to make it available for other modules
export default customerCltr;
