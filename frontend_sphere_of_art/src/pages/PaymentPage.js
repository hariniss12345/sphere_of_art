import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import CheckoutForm from '../components/CheckoutForm'; // Your payment form component

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // For Vite use: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const PaymentPage = () => {
    const clientSecret = useSelector((state) => state.payment.clientSecret);

    const options = {
        clientSecret,
    };

    return (
        <div>
            {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
};

export default PaymentPage;
