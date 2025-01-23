// Importing React library for building user interfaces
import React from 'react';

// Importing ReactDOM for rendering the React application into the DOM
import ReactDOM from 'react-dom/client';

// Importing the main application component
import App from './App';

// Importing BrowserRouter from react-router-dom for enabling routing in the app
import {BrowserRouter} from 'react-router-dom';

// Importing the custom AuthProvider component to handle authentication context
import AuthProvider from './components/AuthProvider.js';

// Getting the root element from the DOM to render the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application wrapped with BrowserRouter and AuthProvider for routing and authentication
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App/>
    </AuthProvider> 
  </BrowserRouter>
);
