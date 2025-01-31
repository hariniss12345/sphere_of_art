// Importing configureStore from Redux Toolkit to configure the Redux store
import { configureStore } from "@reduxjs/toolkit";

// Importing the artist slice reducer to manage the artists' state in the store
import artistReducer from "./slices/artistSlice";



// Configuring the Redux store with the artist slice
const store = configureStore({
    reducer: {
        artists: artistReducer, // Adding the artistReducer to handle artists-related state
        
    },
});

// Exporting the store to be used in the app
export default store;
