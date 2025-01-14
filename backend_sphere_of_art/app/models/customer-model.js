// Importing Schema and model from the Mongoose library
import { Schema, model } from 'mongoose';

// Define the schema for a Customer
const customerSchema = new Schema(
  {
    // Reference to the user this customer is associated with
    user: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Refers to the 'User' collection
    },
    address: String, // Address of the customer
    contactNumber: String, // Contact number of the customer
  },
  {
    // Enable timestamps to automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create a model from the schema
const Customer = model('Customer', customerSchema);

// Export the Customer model for use in other parts of the application
export default Customer;
