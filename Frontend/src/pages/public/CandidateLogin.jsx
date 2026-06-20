import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RefreshCw, User } from 'lucide-react';

const CandidateLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== 'CANDIDATE') {
        logout();
        setErrorMessage('Access Denied: This portal is strictly for candidate accounts.');
      } else {
        navigate('/candidate');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data ||
        'Login failed. Please verify your candidate credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-purple)', marginBottom: '16px' }}>
            <User size={24} />
          </div>
          <h2 className="auth-title">Candidate Portal</h2>
          <p className="auth-subtitle">Log in to upload resume, track scores & apply to jobs</p>
        </div>

        {isExpired && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            padding: '12px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Session expired. Please log in again.
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            padding: '12px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '16px' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 2s linear infinite' }} /> Authenticating...
              </>
            ) : (
              'Sign In as Candidate'
            )}
          </button>
        </form>

        <div className="form-footer" style={{ marginTop: '24px' }}>
        New Candidate? <Link to="/candidate/register" className="form-link">Create Account</Link>
        <div style={{ marginTop: '16px', fontSize: '0.8rem' }}>
          <Link to="/recruiter/login" className="form-link">Recruiter Login</Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CandidateLogin;
