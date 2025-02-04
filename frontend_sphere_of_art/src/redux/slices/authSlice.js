import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

// Forgot Password Action
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:4800/api/users/forgot-password', { email });
        console.log(response.data)
        return response.data.message; // Message from backend
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error occurred");
      }
    }
  );
  
  export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, password }, { rejectWithValue }) => {
      try {
        const response = await axios.post(`http://localhost:4800/api/users/reset-password/${token}`, { password });
        return response.data.message;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );
  

const authSlice = createSlice({
    name: "auth",
    initialState: {
      loading: false,
      message: null,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          // Forgot Password Cases
          .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.message = null;
            state.error = null;
          })
          .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload;
          })
          .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(resetPassword.pending, (state) => {
            state.loading = true;
          })
          .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload;
          })
          .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
    }
});

export default authSlice.reducer;