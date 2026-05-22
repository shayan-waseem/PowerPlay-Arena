import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ArenaProvider } from './context/ArenaContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ArenaProvider>
          {/* Main Router Routing */}
          <AppRoutes />

          {/* Cyberpunk Elegant Notification Toasts */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(16, 20, 36, 0.9)',
                border: '1px solid rgba(29, 36, 62, 0.9)',
                color: '#fff',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.05em',
                borderRadius: '12px',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
                backdropFilter: 'blur(8px)',
              },
            }}
          />
        </ArenaProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
