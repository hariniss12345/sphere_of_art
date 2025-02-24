import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating a review
export const createReview = createAsyncThunk(
  'review/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:4800/api/reviews',
        reviewData,
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching reviews by customer
export const fetchReviewsByCustomer = createAsyncThunk(
  'review/fetchReviewsByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4800/api/reviews/customer/${customerId}`,
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching reviews by artist
export const fetchReviewsByArtist = createAsyncThunk(
  'review/fetchReviewsByArtist',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:4800/api/reviews/artist/${artistId}`,
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      return response.data.reviews;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a review
export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `http://localhost:4800/api/reviews/${reviewId}`,
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a review
export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4800/api/reviews/${reviewId}`,
        updatedData,
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      return response.data.review;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add any synchronous reducers here if needed.
  },
  extraReducers: (builder) => {
    builder
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload.review);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch reviews by customer
      .addCase(fetchReviewsByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch reviews by artist
      .addCase(fetchReviewsByArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.map(review => 
          review._id === action.payload._id ? action.payload : review
        );
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
