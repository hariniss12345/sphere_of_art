import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { createPaymentIntent, confirmPayment } from '../redux/slices/paymentSlice';
import Swal from 'sweetalert2';

const CheckoutForm = ({ orderId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { clientSecret, loading } = useSelector((state) => state.payment);
    const [paymentError, setPaymentError] = useState(null);

    useEffect(() => {
        if (orderId) {
            dispatch(createPaymentIntent(orderId));
        }
    }, [orderId, dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPaymentError(null);

        if (!stripe || !elements) return;

        if (!clientSecret) {
            setPaymentError("Payment session expired. Please refresh and try again.");
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                setPaymentError(error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Dispatch confirmPayment with the property names that the backend expects.
                dispatch(confirmPayment({ 
                    stripePaymentIntentId: paymentIntent.id, 
                    orderId 
                }));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    text: 'Your payment has been processed successfully.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (err) {
            setPaymentError("Something went wrong. Try again.");
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
        },
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-center text-xl mb-4">Complete Your Payment</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <label className="text-sm">Card Details</label>
                <div className="p-3 border border-gray-300 rounded bg-gray-100">
                    <CardElement options={cardElementOptions} />
                </div>
                {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
                <button 
                    type="submit" 
                    className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={!stripe || loading}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
