import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Auth />} />
            <Route path="signup" element={<Auth />} />
            
            {/* Protected Routes mapped to Coming Soon */}
            <Route path="chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="resources" element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            } />
            
            <Route path="contact" element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            } />
            
            <Route path="about" element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            } />

            {/* Catch all for any other protective routes */}
            <Route path="*" element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
