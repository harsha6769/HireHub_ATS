import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw, Bell } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      setErrorMessage('Failed to fetch notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <RefreshCw style={{ animation: 'spin 2s linear infinite', color: '#8b5cf6', marginBottom: '16px' }} size={32} />
        <p>Loading your notifications...</p>
      </div>
    );
  }

  return (
    <div className="widget glass">
      <h3 className="widget-title">Alert Notifications Center</h3>

      {errorMessage && (
        <div style={{ color: '#f87171', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      <div>
        {notifications.map(notif => (
          <div key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`} style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
            {!notif.isRead && <div className="notification-indicator"></div>}
            <div className="notification-body" style={{ flex: 1 }}>
              <p style={{ fontSize: '0.92rem' }}>{notif.message}</p>
              <span className="notification-time">Time: {new Date(notif.createdAt).toLocaleString()}</span>
            </div>
            {!notif.isRead && (
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleMarkAsRead(notif.id)}>
                Dismiss
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && !errorMessage && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
            No alerts or updates found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
