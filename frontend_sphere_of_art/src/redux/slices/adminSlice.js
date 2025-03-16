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
            const response = await axios.put(
                `http://localhost:4800/api/admin/unverify-artist/${artistId}`,
                {},
                { headers: { Authorization: localStorage.getItem("token") } }
            );
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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch logged-in users");
        }
    }
);

// Fetch all orders
export const fetchOrders = createAsyncThunk(
    "admin/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:4800/api/admin/orders-per-artist", {
                headers: { Authorization: localStorage.getItem("token") },
            });
            console.log('bar',response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch orders");
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
        orders: [],
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
            })

            // Handle fetching orders
            .addCase(fetchOrders.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            });
    },
});

export default adminSlice.reducer;
