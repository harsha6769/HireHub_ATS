import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Award } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ display: 'inline-flex', padding: '14px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', color: 'var(--accent-purple)', marginBottom: '24px' }}>
          <Award size={36} />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-1px' }}>Join HireHub ATS</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '1.1rem' }}>
          Choose your account type below to get started with resume matching and vacancies management.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', textAlign: 'left' }}>
          
          {/* Candidate Card */}
          <div className="widget glass" style={{ cursor: 'pointer', transition: 'var(--transition)', padding: '40px', display: 'flex', flexDirection: 'column' }} onClick={() => navigate('/candidate/register')}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.08)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <User size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px' }}>Candidate Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px', flex: 1 }}>
              Upload your PDF resumes, parse tech qualifications instantly, get matched with core vacancies, and track your scoring status.
            </p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Register as Candidate
            </button>
          </div>

          {/* Recruiter Card */}
          <div className="widget glass" style={{ cursor: 'pointer', transition: 'var(--transition)', padding: '40px', display: 'flex', flexDirection: 'column' }} onClick={() => navigate('/recruiter/register')}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.08)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Briefcase size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px' }}>Recruiter Workspace</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px', flex: 1 }}>
              Publish job descriptions, manage vacancy tags, review candidate applications, and securely preview resume details.
            </p>
            <button className="btn btn-primary btn-glow-cyan" style={{ width: '100%', border: 'none' }}>
              Register as Recruiter
            </button>
          </div>

        </div>

        <div style={{ marginTop: '48px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/candidate/login" className="form-link">Candidate Login</Link> or <Link to="/recruiter/login" className="form-link">Recruiter Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
