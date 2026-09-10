import './App.css'
import { Routes, Route } from 'react-router-dom';

// layout
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// pages
import Home from './pages/Home'
import Login from './pages/auth/Login';
import Signup from './pages/auth/Register';
import Forget from './pages/auth/Forget';
import Dashboard from './pages/Dashboard';

// components
import NotFound from './components/NotFound'
import PrivateRoute from './components/PrivateRoute';
import GuestRoute from './components/GuestRoute';

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<GuestRoute> <Login /> </GuestRoute>} />
        <Route path="/auth/signup" element={<GuestRoute> <Signup /> </GuestRoute>} />
        <Route path="/auth/forget" element={<GuestRoute> <Forget /> </GuestRoute>} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
      </Route>

      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
