import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Homepage from './pages/Homepage';
import SignUp from './pages/Signup';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ServiceDetails from './pages/ServiceDetails';
import { authApi } from './lib/api';
import { clearStoredAuth, getStoredToken, getStoredUser } from './lib/auth';

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function restoreSession() {
      const token = getStoredToken();
      const storedUser = getStoredUser();

      if (!token || !storedUser) {
        clearStoredAuth();
        setAuthReady(true);
        return;
      }

      if (storedUser && !ignore) {
        setUser(storedUser);
        setAuthReady(true);
      }

      try {
        const response = await authApi.verify();

        if (!ignore && response?.user) {
          setUser(response.user);
        }
      } catch (error) {
        const status = error?.response?.status;

        if ((status === 401 || status === 403) && !ignore) {
          clearStoredAuth();
          setUser(null);
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
  };

  if (!authReady) {
    return <main className="page-shell"><p className="empty-state">Restoring your session...</p></main>;
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage user={user} />} />
        <Route path="/services/:serviceId" element={<ServiceDetails user={user} />} />
        <Route
          path="/sign-up"
          element={!user ? <SignUp onAuthSuccess={setUser} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />}
        />
        <Route
          path="/sign-in"
          element={!user ? <SignIn onAuthSuccess={setUser} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />}
        />
        <Route
          path="/dashboard"
          element={user ? (user.role === 'admin' ? <Navigate to="/admin" replace /> : <Dashboard user={user} />) : <Navigate to="/sign-in" replace />}
        />
        <Route
          path="/admin"
          element={user ? (user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/dashboard" replace />) : <Navigate to="/sign-in" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;