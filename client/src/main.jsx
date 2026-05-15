import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router/index.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <AppRouter />
        <Toaster position="top-right" />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
