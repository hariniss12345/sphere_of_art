// Importing the Customer model to check for existing customer data
import Customer from '../models/customer-model.js';

// Defining the validation schema for customer data
const customerValidationSchema = {
    // Validation for userId field
    userId: {
        in: ['body'], // Indicates the field should be in the request body
        isMongoId: {
            errorMessage: 'Invalid user ID format. It should be a valid MongoDB ObjectId.', // Custom error message for invalid ObjectId
        },
        notEmpty: {
            errorMessage: 'User ID is required.', // Custom error message when userId is missing
        },
    },
    
    // Validation for address field
    address: {
        in: ['body'], // Indicates the field should be in the request body
        notEmpty: {
            errorMessage: 'Address is required.', // Custom error message when address is missing
        },
        isLength: {
            options: { min: 10, max: 100 }, // Address should be between 10 and 100 characters
            errorMessage: 'Address should be between 10 and 100 characters.',
        },
        trim: true, // Automatically trims whitespace from the address
        custom: {
            // Custom validation to check if the address already exists for the user
            options: async (value, { req }) => {
                try {
                    // Check if the address is already associated with this user
                    const existingCustomer = await Customer.findOne({
                        userId: req.body.userId,
                        address: value,
                    });
                    if (existingCustomer) {
                        throw new Error('This address is already associated with this user.');
                    }
                    return true;
                } catch (err) {
                    throw new Error('Error checking address uniqueness.'); // Handle errors that occur during the address check
                }
            },
        },
    },
    
    // Validation for contactNumber field
    contactNumber: {
        in: ['body'], // Indicates the field should be in the request body
        notEmpty: {
            errorMessage: 'Contact number is required.', // Custom error message when contact number is missing
        }
    }
}

// Export the validation schema to be used elsewhere in the application
export default customerValidationSchema;
