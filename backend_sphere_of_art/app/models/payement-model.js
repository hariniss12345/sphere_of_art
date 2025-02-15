// Importing mongoose to create the schema and interact with MongoDB
import mongoose from 'mongoose';

// Defining the schema for payment transactions
const paymentSchema = new Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, // References the Order model
        ref: 'Order', 
    },
    artistId: { 
        type: mongoose.Schema.Types.ObjectId, // References the Artist model
        ref: 'Artist', 
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, // References the Customer model
        ref: 'Customer', 
    },
    stripePaymentIntentId: { 
        type: String, // Stores the unique payment intent ID from Stripe
    },
    amount: { 
        type: Number, // Total payment amount
    },
    currency: { 
        type: String, // Payment currency (default: USD)
        default: 'usd' 
    },
    adminCommission: { 
        type: Number, // Platform commission fee from the total amount
    },
    artistEarnings: { 
        type: Number, // Earnings the artist receives after commission deduction
    },
    status: { 
        type: String, // Payment status (pending, completed, failed, refunded)
        enum: ['pending', 'completed', 'failed', 'refunded'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, // Timestamp for when the payment record is created
        default: Date.now 
    }
});

// Creating the Payment model from the schema
const Payment = model('Payment', paymentSchema);

// Exporting the model to use in other parts of the application
export default Payment;
