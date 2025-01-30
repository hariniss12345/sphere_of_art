// Importing createSlice from Redux Toolkit to create a slice of state
import { createSlice } from '@reduxjs/toolkit';

// Defining the artist slice to manage the state for artists
const artistSlice = createSlice({
    // The name of the slice; used to identify it in the Redux store
    name: 'artist', 
    
    // The initial state for this slice; it defines the shape of the artist state
    initialState: {
        artists: [], // Array to store the list of artists
        status: 'idle',  // Status can be 'idle', 'loading', 'succeeded', or 'failed'
        error: null,  // Holds any error message if something goes wrong
    },

    // Reducers to handle actions (currently empty, to be defined later)
    reducers: {},
});

// Exporting the reducer from the artist slice to use in the Redux store
export default artistSlice.reducer;
