import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const clientSecret = useSelector((state) => state.payment.clientSecret); // Get from Redux

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (paymentIntent.status === 'succeeded') {
            // Dispatch success action (Optional)
            dispatch({ type: 'payment/success', payload: paymentIntent });

            // Redirect to order confirmation page
            alert('Payment successful!');
            navigate('/order-confirmation');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default CheckoutForm;
