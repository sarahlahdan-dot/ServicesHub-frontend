import { Link } from "react-router";

function Navbar({ user, setUser }) {
  function logOut() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <div>
      {/* Routes seen by everyone */}
      <Link className="nav-item" to="/">
        Homepage
      </Link>

      {user ? (
        <>
          <Link className="nav-item" to="/dashboard">
            Dashboard
          </Link>
          <span className="nav-item">{user.name}</span>
          <button className="nav-item" onClick={logOut}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link className="nav-item" to="/sign-up">
            Sign up
          </Link>
          <Link className="nav-item" to="/sign-in">
            Sign in
          </Link>
        </>
      )}
    </div>
  );
}

export default Navbar;
