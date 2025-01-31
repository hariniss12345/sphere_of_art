import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  order: null,
  loading: false,
  success: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4700/api/orders', formData, {
        headers: {
            Authorization: localStorage.getItem("token") // Important for file uploads
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log('Order placed successfully:', action.payload); 
        state.order = action.payload
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;