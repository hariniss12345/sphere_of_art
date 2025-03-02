import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch Artists from Backend
export const fetchArtists = createAsyncThunk('artists/fetchArtists', async () => {
  const response = await axios.get('http://localhost:4800/api/artists');
  console.log("Fetched artists:", response.data);
  return response.data; // Return the fetched artist data
});

const artistSlice = createSlice({
  name: 'artists',
  initialState: {
    artists: [],
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.artists = action.payload; // Update artists in the state
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default artistSlice.reducer;
