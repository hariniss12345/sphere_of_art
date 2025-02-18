import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to create payment intent
export const createPaymentIntent = createAsyncThunk(
    'payment/createPaymentIntent',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:4800/api/payment-intent', { orderId }, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            return response.data.clientSecret;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        clientSecret: null,
        loading: false,
        error: null
    },
    reducers: {},
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
            });
    }
});

export default paymentSlice.reducer;
