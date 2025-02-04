import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const authSlice = createSlice({
    name: "auth",
    initialState: {
      loading: false,
      message: null,
      error: null,
    },
    reducers: {},
});

export default authSlice.reducer;