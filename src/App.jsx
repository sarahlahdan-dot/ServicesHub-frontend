import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import ServiceListing from "./pages/ServiceListing";
import ServiceDetail from "./pages/ServiceDetail";
import MyBookings from "./pages/MyBookings";
import ProviderBookings from "./pages/ProviderBookings";
import ProviderServices from "./pages/ProviderServices";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split(".")[1])).payload;
        setUser(userInfo);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Homepage />} />
        <Route path="/services" element={<ServiceListing />} />
        <Route path="/services/:id" element={<ServiceDetail user={user} />} />

        {/* Auth — redirect if already logged in */}
        <Route
          path="/sign-up"
          element={!user ? <SignUp /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/sign-in"
          element={
            !user ? <SignIn setUser={setUser} /> : <Navigate to="/dashboard" />
          }
        />

        {/* Protected — any logged-in user */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/sign-in" />
          }
        />

        {/* Protected — customer only */}
        <Route
          path="/my-bookings"
          element={
            user && user.role === "customer" ? (
              <MyBookings user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />

        {/* Protected — provider only */}
        <Route
          path="/provider/bookings"
          element={
            user && user.role === "provider" ? (
              <ProviderBookings user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />
        <Route
          path="/provider/services"
          element={
            user && user.role === "provider" ? (
              <ProviderServices user={user} />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />

        {/* Protected — admin only */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
