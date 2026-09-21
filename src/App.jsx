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
import MyLinks from './pages/MyLinks';

// components
import NotFound from './components/status/NotFound'
import LinkExpired from './components/status/LinkExpired'
import GuestRoute from './routes/GuestRoute'
import PrivateRoute from './routes/PrivateRoute'
import VerifyEmail from './components/status/VerifyEmail';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<GuestRoute> <Login /> </GuestRoute>} />
        <Route path="/auth/signup" element={<GuestRoute> <Signup /> </GuestRoute>} />
        <Route path="/auth/forgot" element={<GuestRoute> <Forget /> </GuestRoute>} />
        <Route path='/auth/verify-email' element={<VerifyEmail />} ></Route>
        <Route path='/auth/reset-password' element={<ResetPassword />} ></Route>
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/my-dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path="/my-links" element={<PrivateRoute> <MyLinks /> </PrivateRoute>} />
        <Route path="/my-profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
        <Route path="/my-analytics" element={<PrivateRoute> <Analytics /> </PrivateRoute>} />
      </Route>

      <Route path="/not-found" element={<NotFound />} />
      <Route path="/link-expired" element={<LinkExpired />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
