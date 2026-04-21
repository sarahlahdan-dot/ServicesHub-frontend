import { Link, NavLink } from 'react-router';

function Navbar({ user, onLogout }) {
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <header className="topbar">
      <div className="brand-block">
        <Link className="brand-mark" to="/">
          <span>SH</span>
        </Link>
        <div>
          <Link className="brand-name" to="/">ServicesHub</Link>
          <p className="brand-copy">Book trusted local services and manage every request in one place.</p>
        </div>
      </div>

      <nav className="topbar-nav">
        <NavLink className="nav-item" to="/">Services</NavLink>

        {user ? (
          <>
            <NavLink className="nav-item" to={dashboardPath}>{user.role === 'admin' ? 'Admin' : 'Dashboard'}</NavLink>
            <span className="nav-pill">{user.name} · {user.role}</span>
            <button className="ghost-button" onClick={onLogout} type="button">Log out</button>
          </>
        ) : (
          <>
            <NavLink className="nav-item" to="/sign-up">Create account</NavLink>
            <NavLink className="primary-button small" to="/sign-in">Sign in</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
