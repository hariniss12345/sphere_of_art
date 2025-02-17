import Stripe from 'stripe';
import Payment from '../models/payment.js'; // Adjust the path as needed
import Order from '../models/order.js'; // Adjust the path as needed
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const paymentCltr ={}

export default paymentCltr