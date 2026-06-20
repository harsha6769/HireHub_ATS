import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RefreshCw, User } from 'lucide-react';

const CandidateRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: 'CANDIDATE',
      enabled: true
    };

    try {
      await register(userData);
      setSuccessMessage('Candidate registration successful! Redirecting to login page...');
      setTimeout(() => {
        navigate('/candidate/login');
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Email might already be in use.'
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
          <h2 className="auth-title">Candidate Registration</h2>
          <p className="auth-subtitle">Create a candidate profile to apply for vacancies</p>
        </div>

        {successMessage && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            color: '#4ade80',
            padding: '12px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {successMessage}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 2s linear infinite' }} /> Creating Account...
              </>
            ) : (
              'Register as Candidate'
            )}
          </button>
        </form>

        <div className="form-footer">
          Already have a candidate profile? <Link to="/candidate/login" className="form-link">Sign In</Link>
          <div style={{ marginTop: '16px', fontSize: '0.8rem' }}>
            Are you a Recruiter? <Link to="/recruiter/register" className="form-link">Register Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;
