import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Verify artist
export const verifyArtist = createAsyncThunk(
    "admin/verifyArtist",
    async (artistId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:4800/api/admin/verify-artist/${artistId}`,{},{
                headers: { Authorization: localStorage.getItem('token') } }
            );
            return response.data.artists
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to verify artist");
        }
    }
);

// Unverify artist
export const unverifyArtist = createAsyncThunk(
    "admin/unverifyArtist",
    async (artistId, { rejectWithValue }) => {
        try {
           const response =  await axios.put(`http://localhost:4800/api/admin/unverify-artist/${artistId}`,{},{
            headers: { Authorization: localStorage.getItem('token') } 
           });
           console.log(response.data.artists)
            return response.data.artists;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to unverify artist");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: { 
        verifiedArtists: [], 
        status: "idle", 
        error: null 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle verifying artist
            .addCase(verifyArtist.fulfilled, (state, action) => {
                state.verifiedArtists.push(action.payload);
            })
            .addCase(verifyArtist.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Handle unverifying artist
            .addCase(unverifyArtist.fulfilled, (state, action) => {
                state.verifiedArtists = state.verifiedArtists.filter(id => id !== action.payload);
            })
            .addCase(unverifyArtist.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default adminSlice.reducer;
