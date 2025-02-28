import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to verify artist
export const verifyArtist = createAsyncThunk(
    'admin/verifyArtist',
    async (artistId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:4800/api/admin/verify-artist/${artistId}`,{
                headers: { Authorization: localStorage.getItem('token') } 
            });
            return response.data.artist;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: { verifiedArtists: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyArtist.pending, (state) => { state.loading = true; })
            .addCase(verifyArtist.fulfilled, (state, action) => {
                state.loading = false;
                state.verifiedArtists.push(action.payload);
            })
            .addCase(verifyArtist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminSlice.reducer;
