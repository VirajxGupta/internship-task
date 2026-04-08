import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <div className="header-logo">P</div>
          <div>
            <div className="header-title">PostStream</div>
            <div className="header-subtitle">Real-time Explorer</div>
          </div>
        </Link>

        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            ✦ All Posts
          </Link>
        </nav>
      </div>
    </header>
  );
}
