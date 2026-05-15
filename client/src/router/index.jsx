import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Landing from '../pages/Landing';
import CreatePoll from '../pages/CreatePoll';
import Analytics from '../pages/Analytics';
import PollResponse from '../pages/PollResponse';
import PollResults from '../pages/PollResults';
import NotFound from '../pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  return <Layout>{children}</Layout>;
}

const router = createBrowserRouter([
  { path: '/', element: <PublicRoute><Landing /></PublicRoute> },
  { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/polls', element: <Navigate to="/dashboard" replace /> }, 
  { path: '/analytics', element: <Navigate to="/dashboard" replace /> }, 
  { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
  { path: '/register', element: <PublicRoute><Register /></PublicRoute> },
  { path: '/create', element: <ProtectedRoute><CreatePoll /></ProtectedRoute> },
  { path: '/polls/:id/analytics', element: <ProtectedRoute><Analytics /></ProtectedRoute> },
  { path: '/poll/:shareId', element: <PublicRoute><PollResponse /></PublicRoute> },
  { path: '/results/:shareId', element: <PublicRoute><PollResults /></PublicRoute> },
  { path: '*', element: <PublicRoute><NotFound /></PublicRoute> } 
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
