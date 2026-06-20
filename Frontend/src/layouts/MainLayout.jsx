import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Award, Sun, Moon, LogOut, Briefcase, Users } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isLightMode, setIsLightMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      {/* Navbar */}
      <nav className="navbar glass">
        <Link to="/" className="nav-brand">
          <Award className="text-gradient" size={28} />
          <span className="text-gradient">HireHub ATS</span>
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className={`nav-link ${location.pathname === '/jobs' ? 'active' : ''}`}>
              Find Jobs
            </Link>
          </li>
          
          {user && user.role === 'CANDIDATE' && (
            <li>
              <Link to="/candidate" className="nav-link">
                Dashboard
              </Link>
            </li>
          )}
          {user && user.role === 'RECRUITER' && (
            <li>
              <Link to="/recruiter" className="nav-link">
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {/* Theme Switcher */}
          <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '8px 12px' }} title="Toggle Theme">
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hi, <strong>{user.firstName}</strong>
              </span>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 14px' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/candidate/login" className="btn btn-secondary">Candidate Login</Link>
              <Link to="/recruiter/login" className="btn btn-secondary">Recruiter Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Outlet */}
      <main style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer glass">
        <p>&copy; 2026 HireHub ATS Platform Inc. All rights reserved. Real-time API Integrated.</p>
      </footer>
    </>
  );
};

export default MainLayout;
