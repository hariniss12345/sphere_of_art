import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

// Async thunk to upload a portfolio work
export const uploadPortfolioWork = createAsyncThunk(
  'portfolio/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4800/api/portfolios/upload', formData, {
        headers: { Authorization: localStorage.getItem("token"), },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload portfolio');
    }
  }
);

// Async thunk to fetch all portfolio works of an artist
export const fetchPortfolioWorks = createAsyncThunk(
  'portfolio/fetch',
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/portfolio/${artistId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch portfolio');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    portfolios: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPortfolioWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPortfolioWork.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios.push(action.payload.portfolio);
        state.successMessage = action.payload.message;
      })
      .addCase(uploadPortfolioWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPortfolioWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload.portfolios;
      })
      .addCase(fetchPortfolioWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuccessMessage } = portfolioSlice.actions;
export default portfolioSlice.reducer;
