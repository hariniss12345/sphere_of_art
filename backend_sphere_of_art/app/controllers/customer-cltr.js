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

// Define the show method in the customer controller to retrieve the current customer's information
customerCltr.show = async (req, res) => {
    try {
        // Fetch the customer record from the database using the userId from the JWT token (stored in req.currentUser)
        const customer = await Customer.findOne({ userId: req.currentUser.userId });

        // If no customer record is found, return a 400 response indicating the record was not found
        if (!customer) {
            return res.status(400).json({ error: 'record not found' });
        }

        // Respond with the customer data in JSON format
        res.json(customer);
    } catch (err) {
        // Log any errors that occur during the process
        console.log(err.message);

        // Return a 500 response indicating a server-side error
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Define the update method in the customer controller to update the customer's information
customerCltr.update = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // If validation errors exist, return a 400 response with the error details
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id; // Extract customer ID from URL parameters
    const body = req.body; // Extract updated data from request body

    try {
        // Update the customer document by its ID
        const customer = await Customer.findOneAndUpdate(
            { _id: id }, // Query condition to find the document
            body,        // Data to update
            { new: true, runValidators: true } // Options: return updated document and validate
        );

        if (!customer) {
            // If no matching customer found, return an error
            return res.status(404).json({ error: 'record not found' });
        }

        // Return the updated customer document
        res.json(customer);
    } catch (err) {
        // Log and handle any errors during the update process
        console.error(err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// Define the delete method in the customer controller to delete the customer's information
customerCltr.delete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If validation errors exist, return a 400 response with the error details
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id; // Extract customer ID from URL parameters

    try {
        // Delete the customer document by its ID
        const customer = await Customer.findOneAndDelete({ _id: id }); // Use the ID to find and delete

        if (!customer) {
            // If no matching customer found, return an error
            return res.status(404).json({ error: 'record not found' });
        }

        // Return the deleted customer document
        res.json({ message: 'Customer deleted successfully', customer });
    } catch (err) {
        // Log and handle any errors during the delete process
        console.error(err.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
}


// Export the customer controller to make it available for other modules
export default customerCltr;
