import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
            process.env.REACT_APP_CLIENT_SECRET, // This should be from Redux, but stored in env for now
            { payment_method: { card: cardElement } }
        );

        if (error) {
            setError(error.message);
        } else {
            dispatch({ type: 'payment/success', payload: paymentIntent });
            alert('Payment successful!');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default CheckoutForm;
