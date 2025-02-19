import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to create payment intent
export const createPaymentIntent = createAsyncThunk(
    'payment/createPaymentIntent',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:4800/api/payment-intent',
                { orderId },
                { headers: { Authorization: localStorage.getItem('token') } }
            );
            return response.data.clientSecret;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Async thunk to confirm payment (after Stripe processes the payment)
export const confirmPayment = createAsyncThunk(
    'payment/confirmPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:4800/api/payment-confirm',
                paymentData,
                { headers: { Authorization: localStorage.getItem('token') } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Payment confirmation failed");
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        clientSecret: null,
        paymentStatus: null,
        loading: false,
        error: null
    },
    reducers: {
        resetPaymentState: (state) => {
            state.clientSecret = null;
            state.paymentStatus = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.clientSecret = action.payload;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(confirmPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentStatus = action.payload;
            })
            .addCase(confirmPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
