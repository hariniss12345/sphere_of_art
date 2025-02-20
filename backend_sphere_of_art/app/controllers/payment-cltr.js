import Stripe from 'stripe';
import Payment from '../models/payment-model.js';
import Order from '../models/order-model.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentCltr = {};

paymentCltr.create = async (req, res) => {
    try {
        const { orderId } = req.body;

        // Check if order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Ensure the order has a valid price
        const amount = order.totalPrice * 100; // Convert to cents

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // Create a Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: { orderId: order._id.toString() }
        });

        // Save Payment details in the database
        const newPayment = new Payment({
            orderId: order._id,
            artistId: order.artist,
            customerId: order.customer,
            stripePaymentIntentId: paymentIntent.id,
            amount: order.totalPrice,
            currency: 'usd',
            adminCommission: order.totalPrice * 0.1,
            artistEarnings: order.totalPrice * 0.9,  
            status: 'pending'
        });

        await newPayment.save()

        res.status(201).json({ clientSecret: paymentIntent.client_secret})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

paymentCltr.confirm = async (req, res) => {
    try {
      // Destructure stripePaymentIntentId and orderId from req.body
      const { stripePaymentIntentId, orderId } = req.body;
      console.log(stripePaymentIntentId,orderId)
      if (!stripePaymentIntentId || !orderId) {
        return res.status(400).json({ error: "Payment ID and Order ID are required" });
      }
  
      // Retrieve the PaymentIntent from Stripe using stripePaymentIntentId
      const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: "Payment not completed" });
      }
  
      // Update the order status to "Paid"
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: 'Paid' },
        { new: true }
      );
  
      // Update the Payment record's status in your database
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: stripePaymentIntentId },
        { status: 'succeeded' }
      );
  
      res.json({ success: true, message: "Payment confirmed!", order: updatedOrder });
    } catch (error) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ error: error.message });
    }
  };

export default paymentCltr;
