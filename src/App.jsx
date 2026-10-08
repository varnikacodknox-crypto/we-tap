import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import UsersList from './pages/users/UsersList';
import CardsList from './pages/cards/CardsList';
import RequestCardList from './pages/request/RequestCardList';
import PlaceCardList from './pages/placecard/PlaceCardList';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<AuthLayout />}>
            <Route index element={<SignIn />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Main App Routes */}
          <Route path="/main" element={<MainLayout />}>
            <Route index element={<Navigate to="/main/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users/list" element={<UsersList />} />
            <Route path="cards/list" element={<CardsList />} />
            <Route path="request/list" element={<RequestCardList />} />
            <Route path="placecard/list" element={<PlaceCardList />} />
            <Route path="setting" element={<Settings />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/main/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
