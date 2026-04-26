import { Link } from "react-router";

function Navbar({ user, setUser }) {
  function logOut() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-dot"></span>
        ServiceHub
      </Link>

      <ul className="navbar-links">
        <li>
          <Link to="/services">Browse</Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {user.role === "customer" && (
              <li>
                <Link to="/my-bookings">My Bookings</Link>
              </li>
            )}
            {user.role === "provider" && (
              <>
                <li>
                  <Link to="/provider/bookings">Bookings</Link>
                </li>
                <li>
                  <Link to="/provider/services">My Services</Link>
                </li>
              </>
            )}
            {user.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <span className="navbar-user">👤 {user.name}</span>
            </li>
            <li>
              <button className="btn-nav-logout" onClick={logOut}>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
            <li>
              <Link to="/sign-up" className="btn-nav-primary">
                Get Started
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
