// Importing React library for building user interfaces
import React from 'react';

// Importing ReactDOM for rendering the React application into the DOM
import ReactDOM from 'react-dom/client';

// Importing the main application component
import App from './App';

// Importing BrowserRouter from react-router-dom for enabling routing in the app
import {BrowserRouter} from 'react-router-dom';

// Import Provider from react-redux
import { Provider } from 'react-redux';

// Import the store
import store from './redux/store';      

// Importing the custom AuthProvider component to handle authentication context
import AuthProvider from './components/AuthProvider.js';

// Render the app with Redux Provider wrapped around the application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>  {/* Wrap your app with Redux Provider */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);