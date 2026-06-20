import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Award, Briefcase, Users, Calendar, Bell, User, BarChart2, LogOut, Sun, Moon, ShieldAlert 
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLightMode, setIsLightMode] = useState(false);

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

  // Sidebar items based on roles
  const getSidebarItems = () => {
    if (user.role === 'CANDIDATE') {
      return [
        { label: 'Overview', path: '/candidate', icon: <Award size={18} /> },
        { label: 'My Applications', path: '/candidate/applications', icon: <Briefcase size={18} /> },
        { label: 'Notifications', path: '/candidate/notifications', icon: <Bell size={18} /> },
        { label: 'Edit Skills', path: '/candidate/profile', icon: <User size={18} /> }
      ];
    } else if (user.role === 'RECRUITER') {
      return [
        { label: 'Analytics & Metrics', path: '/recruiter', icon: <BarChart2 size={18} /> },
        { label: 'Post New Job', path: '/recruiter/create-job', icon: <Briefcase size={18} /> },
        { label: 'Manage Jobs', path: '/recruiter/manage-jobs', icon: <Briefcase size={18} /> },
        { label: 'Applicant Database', path: '/recruiter/applicants', icon: <Users size={18} /> }
      ];
    }
    return [];
  };

  const sidebarItems = getSidebarItems();

  return (
    <>
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      {/* Sticky top headers inside Dashboard layout */}
      <nav className="navbar glass">
        <Link to="/" className="nav-brand">
          <Award className="text-gradient" size={28} />
          <span className="text-gradient">HireHub ATS</span>
        </Link>

        <div className="nav-actions">
          <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '8px 12px' }} title="Toggle Theme">
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Logged in: <strong>{user?.firstName}</strong> ({user?.role.replace('_', ' ')})
            </span>
            <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 14px' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Panel layout */}
      <div className="dashboard-container">
        
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <h3 className="sidebar-heading">Workspace</h3>
          {sidebarItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.label} to={item.path} className={`sidebar-item ${isActive ? 'active' : ''}`}>
                {item.icon} {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Dynamic Nested Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      {/* Global Dashboard Sticky Footer */}
      <footer className="footer glass" style={{ marginTop: 0 }}>
        <p>&copy; 2026 HireHub ATS Center. Backend Connected.</p>
      </footer>
    </>
  );
};

export default DashboardLayout;
