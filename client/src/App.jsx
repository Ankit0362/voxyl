import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const Dashboard = () => <div className="p-8">Dashboard placeholder</div>;
const CreatePoll = () => <div className="p-8">Create Poll placeholder</div>;
const EditPoll = () => <div className="p-8">Edit Poll placeholder</div>;
const PollAnalytics = () => <div className="p-8">Poll Analytics placeholder</div>;
const PublicPoll = () => <div className="p-8">Public Poll placeholder</div>;
const PollResults = () => <div className="p-8">Poll Results placeholder</div>;
const NotFound = () => <div className="p-8 flex justify-center items-center h-full"><h1 className="text-3xl font-bold">404 - Not Found</h1></div>;

const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            {}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/p/:shareToken" element={<PublicPoll />} />
            <Route path="/p/:shareToken/results" element={<PollResults />} />

            {}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/polls/create" element={<CreatePoll />} />
              <Route path="/polls/:pollId/edit" element={<EditPoll />} />
              <Route path="/polls/:pollId/analytics" element={<PollAnalytics />} />
            </Route>

            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
