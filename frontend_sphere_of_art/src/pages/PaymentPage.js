import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutForm from '../pages/CheckoutForm';
import { createPaymentIntent } from '../redux/slices/paymentSlice';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
    const { orderId } = useParams(); 
    const dispatch = useDispatch();
    
    console.log("Received orderId in PaymentPage:", orderId);

    const clientSecret = useSelector((state) => state.payment.clientSecret);
    const loading = useSelector((state) => state.payment.loading);
    const error = useSelector((state) => state.payment.error);

    useEffect(() => {
        console.log("Checking orderId before API call:", orderId);
        if (!clientSecret && orderId) {
            dispatch(createPaymentIntent(orderId));
        }
    }, [clientSecret, orderId, dispatch]);

    
    const options = clientSecret ? { clientSecret: clientSecret.clientSecret } : null;

    return (
        <div>
            <h2>Payment Page</h2>
            <p><strong>Order ID:</strong> {orderId}</p>

            {loading && <p>Loading payment details...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;
