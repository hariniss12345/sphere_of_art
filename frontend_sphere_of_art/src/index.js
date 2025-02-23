import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AuthProvider from './components/AuthProvider.js';
import { SocketProvider } from './context/SocketContext';  // import the provider

console.log('store', store.getState());

store.subscribe(() => {
  console.log('state updated', store.getState());
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
