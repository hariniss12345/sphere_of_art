// Importing necessary functions from Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Importing axios for making API requests
import axios from 'axios';

// Defining an asynchronous thunk action to fetch artists from the backend
export const fetchArtists = createAsyncThunk('artists/fetchArtists', async () => {
  const response = await axios.get('http://localhost:4700/api/artists'); // Replace with your actual backend endpoint
  console.log(response.data)
  return response.data; // Returning the fetched artist data
});

// Creating the artist slice to manage artist-related state
const artistSlice = createSlice({
  name: 'artists', // Slice name
  initialState: {
    artists: [], // Stores fetched artist data
    status: 'idle',  // Status can be 'idle', 'loading', 'succeeded', or 'failed'
    error: null, // Stores error messages, if any
  },
  reducers: {}, // Reducers for synchronous actions (currently empty)
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.status = 'loading'; // Set status to loading when request starts
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded when request is successful
        state.artists = action.payload;  // Update artists state with fetched data
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed when request fails
        state.error = action.error.message; // Store error message
      });
  },
});

// Exporting the reducer to be used in the store
export default artistSlice.reducer;
