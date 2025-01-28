// Importing the necessary modules from mongoose
import { Schema, model } from 'mongoose'

// Defining the order schema for the Order collection
const orderSchema = new Schema({
    // Refers to the customer making the order, linked to the 'Customer' model
    customer: {
        type: Schema.Types.ObjectId,  // Using ObjectId to link the customer
        ref: 'User'               // Reference to the 'Customer' model
    },
    // Refers to the artist handling the order, linked to the 'Artist' model
    artist: {
        type: Schema.Types.ObjectId,  // Using ObjectId to link the artist
        ref: 'User'                // Reference to the 'Artist' model
    },
    // Refers to the art(s) ordered by the customer, linked to the 'Art' model
    arts: [{
        type: Schema.Types.ObjectId,  // Using ObjectId to link each art piece
        ref: 'Art'                    // Reference to the 'Art' model
    }],
    // Custom request from the customer, optional text field
    customRequest: String,
    // Status of the order, can be 'pending', 'in progress', 'completed', or 'cancelled'
    status: {
        type: String,
        default: 'pending'            // Default status is 'pending'
    },
    // Price of the order, presumably the cost of the artwork
    price: Number,
    // Additional delivery charges for the order
    deliveryCharges: Number,
    // Total price of the order (price + delivery charges)
    totalPrice: Number,
    // The due date for the order completion
    dueDate: Date, // Date type for handling the due date
    // Boolean to track if the artist has accepted the order
    artistHasAccepted: {
        type: Boolean,
        default: false  // Default value is false (order not accepted by artist)
    },
    // Boolean to track if the customer has accepted the final artwork
    customerHasAccepted: {
        type: Boolean,
        default: false  // Default value is false (order not accepted by customer)
    }
}, {
    // Automatically add timestamps for creation and update
    timestamps: true
})

// Creating the model based on the schema, so it can be used for CRUD operations
const Order = model('Order', orderSchema)

// Exporting the model for use in other parts of the application
export default Order
