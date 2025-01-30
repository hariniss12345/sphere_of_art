// Importing the configureStore function from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Setting up the Redux store using configureStore
const store = configureStore({
    // The reducer object will hold all the slices of the application
    reducer: {} // Currently empty, will add slices like 'artist', 'order', etc.
});

// Exporting the store to be used in the application
export default store;
