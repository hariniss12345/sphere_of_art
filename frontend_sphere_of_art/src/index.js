// Importing React library for building user interfaces
import React from 'react';

// Importing ReactDOM for rendering the React application into the DOM
import ReactDOM from 'react-dom/client';

// Importing the main application component
import App from './App';

// Importing BrowserRouter from react-router-dom for enabling routing in the app
import { BrowserRouter } from 'react-router-dom';

// Importing Provider from react-redux to integrate Redux state management
import { Provider } from 'react-redux';

// Importing the Redux store to provide global state to the application
import store from './redux/store';      

// Importing the custom AuthProvider component to handle authentication context
import AuthProvider from './components/AuthProvider.js';

// Creating a root element for React rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application inside the root element
root.render(
  <Provider store={store}>  {/* Wrapping the app with Redux Provider to enable global state management */}
    <BrowserRouter>  {/* Wrapping with BrowserRouter to enable routing */}
      <AuthProvider>  {/* Wrapping with AuthProvider to manage authentication state */}
        <App />  {/* Rendering the main application component */}
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
