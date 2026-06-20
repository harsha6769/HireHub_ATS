import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Award, Briefcase, Bell, Calendar, RefreshCw, Check, AlertCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [appRes, notifRes] = await Promise.all([
        api.get('/applications/candidate'),
        api.get('/notifications')
      ]);

      setApplications(appRes.data);
      setNotifications(notifRes.data);
    } catch (err) {
      console.error('Failed to load candidate dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissNotif = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const calculateAverageAts = () => {
    if (applications.length === 0) return 0;
    const sum = applications.reduce((acc, app) => acc + app.atsScore, 0);
    return Math.floor(sum / applications.length);
  };

  const avgScore = calculateAverageAts();

  if (isLoading) {
    return (
      <div>
        {/* Welcome Banner Skeleton */}
        <div className="welcome-banner skeleton" style={{ height: '140px', background: 'none', width: '100%', marginBottom: '32px' }}></div>

        <div className="widget-grid">
          {/* ATS Gauge Widget Skeleton */}
          <div className="widget glass" style={{ gridColumn: 'span 4', height: '290px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton" style={{ height: '110px', width: '110px', borderRadius: '50%', marginBottom: '16px' }}></div>
            <div className="skeleton" style={{ height: '14px', width: '60%' }}></div>
          </div>

          {/* Submissions Table Widget Skeleton */}
          <div className="widget glass" style={{ gridColumn: 'span 8', height: '290px' }}>
            <div className="skeleton" style={{ height: '20px', width: '150px', marginBottom: '24px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '40%' }}>
                    <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '6px' }}></div>
                    <div className="skeleton" style={{ height: '10px', width: '40%' }}></div>
                  </div>
                  <div className="skeleton" style={{ height: '14px', width: '50px' }}></div>
                  <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: '20px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-info">
          <h1>Welcome Back, {user.firstName}!</h1>
          <p>You have submitted {applications.length} application(s). Check your screening scores below.</p>
        </div>
        <Link to="/jobs" className="btn btn-glow-cyan">
          <Search size={16} /> Explore New Vacancies
        </Link>
      </div>

      <div className="widget-grid">
        
        {/* ATS Score gauge */}
        <div className="widget glass" style={{ gridColumn: 'span 4' }}>
          <h3 className="widget-title">Average ATS Score</h3>
          {applications.length > 0 ? (
            <div className="ats-score-container">
              <div className="ats-score-display">
                <svg width="150" height="150" className="circular-progress-svg">
                  <circle cx="75" cy="75" r="60" className="circular-bg" strokeWidth="10" />
                  <circle cx="75" cy="75" r="60" className="circular-fill" strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - avgScore / 100)}
                  />
                </svg>
                <span className="ats-score-value" style={{ fontSize: '2rem' }}>{avgScore}%</span>
              </div>
              <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Excellent standing! Target scores over 80% to maximize responses.
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No ATS scores generated yet. Apply to open roles first.
            </div>
          )}
        </div>

        {/* Applied Jobs table summary */}
        <div className="widget glass" style={{ gridColumn: 'span 8' }}>
          <h3 className="widget-title">Submissions</h3>
          {applications.length > 0 ? (
            <div className="ranking-table-container">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>ATS Match</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div className="candidate-name-cell">
                          <strong>{app.job?.title}</strong>
                          <span className="candidate-subtext">📍 {app.job?.location}</span>
                        </div>
                      </td>
                      <td>
                        <span className="score-badge" style={{ color: app.atsScore >= 80 ? '#4ade80' : '#fbbf24' }}>
                          {app.atsScore}%
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill status-${app.status.toLowerCase().replace('_', '')}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              No active applications. Find open opportunities in the "Find Jobs" portal.
            </div>
          )}
        </div>

      </div>

      <div className="widget-grid">
        
        {/* Notifications list */}
        <div className="widget glass" style={{ gridColumn: 'span 12' }}>
          <h3 className="widget-title">Alert notifications</h3>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.filter(n => !n.isRead).slice(0, 5).map(notif => (
              <div key={notif.id} className="notification-item unread" style={{ padding: '16px', marginBottom: '12px' }}>
                <div className="notification-indicator"></div>
                <div className="notification-body" style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{notif.message}</p>
                  <span 
                    style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }} 
                    onClick={() => handleDismissNotif(notif.id)}
                  >
                    Dismiss Notification
                  </span>
                </div>
              </div>
            ))}
            {notifications.filter(n => !n.isRead).length === 0 && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0', fontSize: '0.9rem' }}>
                All notifications dismissed.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
