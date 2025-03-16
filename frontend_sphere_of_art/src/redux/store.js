// Importing configureStore from Redux Toolkit to configure the Redux store
import { configureStore } from "@reduxjs/toolkit";

// Importing the artist slice reducer to manage the artists' state in the store
import artistReducer from "./slices/artistSlice";

import orderReducer from "./slices/orderSlice"

import authReducer from "./slices/authSlice"; 

import portfolioReducer from './slices/portfolioSlice';

import paymentReducer from './slices/paymentSlice';

import reviewReducer from './slices/reviewSlice'

import adminReducer from './slices/adminSlice'

// Configuring the Redux store with the artist slice
const store = configureStore({
    reducer: {
        artists: artistReducer, 
        order: orderReducer,
        auth: authReducer,
        portfolio: portfolioReducer,
        payment: paymentReducer,
        review: reviewReducer,
        admin: adminReducer
    }, 
});

// Exporting the store to be used in the app
export default store;