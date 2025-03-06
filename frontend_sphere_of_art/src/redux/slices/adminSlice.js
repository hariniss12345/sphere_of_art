import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Verify artist
export const verifyArtist = createAsyncThunk(
    "admin/verifyArtist",
    async (artistId, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:4800/api/admin/verify-artist/${artistId}`,
                {},
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            console.log("veri", response.data);
            return response.data;
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
            console.log("artist", artistId);
            const response = await axios.put(
                `http://localhost:4800/api/admin/unverify-artist/${artistId}`,
                {},
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            console.log("res", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to unverify artist");
        }
    }
);

// Fetch logged-in artists and customers
export const fetchLoggedInUsers = createAsyncThunk(
    "admin/fetchLoggedInUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:4800/api/admin/manage-users", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            console.log("Logged-in Users", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch logged-in users");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        verifiedArtists: [],
        loggedInUsers: {
            artists: [],
            customers: [],
            artistsCount: 0,
            customersCount: 0,
        },
        status: "idle",
        error: null,
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
            })

            // Handle fetching logged-in users
            .addCase(fetchLoggedInUsers.fulfilled, (state, action) => {
                state.loggedInUsers = {
                    artists: action.payload.loggedInArtists,
                    customers: action.payload.loggedInCustomers,
                    artistsCount: action.payload.loggedInArtistsCount,
                    customersCount: action.payload.loggedInCustomersCount,
                };
            })
            .addCase(fetchLoggedInUsers.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default adminSlice.reducer;
