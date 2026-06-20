import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Users, Award, Check, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [hiredCount, setHiredCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecruiterMetrics();
  }, []);

  const fetchRecruiterMetrics = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch jobs posted by the recruiter
      const jobRes = await api.get('/jobs/recruiter');
      const recruiterJobs = jobRes.data;
      setJobs(recruiterJobs);

      // 2. Fetch all applications for the recruiter's postings in a single query
      const appRes = await api.get('/applications/recruiter');
      const recruiterApps = Array.isArray(appRes.data) ? appRes.data : [];
      setApps(recruiterApps);

      // 3. Count hires
      const currentHiresCount = recruiterApps.filter(a => a.status === 'HIRED').length;
      setHiredCount(currentHiresCount);
    } catch (err) {
      console.error('Failed to compile recruiter analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const shortlistedCount = apps.filter(a => a.status === 'SHORTLISTED' || a.status === 'HIRED').length;

  if (isLoading) {
    return (
      <div>
        {/* Metric Cards Skeletons */}
        <div className="metric-row">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="metric-card glass" style={{ height: '108px' }}>
              <div style={{ width: '60%' }}>
                <div className="skeleton" style={{ height: '12px', width: '90%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '28px', width: '50%' }}></div>
              </div>
              <div className="skeleton" style={{ height: '48px', width: '48px', borderRadius: '12px' }}></div>
            </div>
          ))}
        </div>

        <div className="widget-grid">
          {/* Top Rankings Table Skeleton */}
          <div className="widget glass" style={{ gridColumn: 'span 7', height: '320px' }}>
            <div className="skeleton" style={{ height: '20px', width: '150px', marginBottom: '24px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton" style={{ height: '14px', width: '120px' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '90px' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '40px' }}></div>
                  <div className="skeleton" style={{ height: '20px', width: '70px', borderRadius: '10px' }}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Job Roles List Skeleton */}
          <div className="widget glass" style={{ gridColumn: 'span 5', height: '320px' }}>
            <div className="skeleton" style={{ height: '20px', width: '130px', marginBottom: '24px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '60%' }}>
                    <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '6px' }}></div>
                    <div className="skeleton" style={{ height: '10px', width: '40%' }}></div>
                  </div>
                  <div className="skeleton" style={{ height: '20px', width: '70px', borderRadius: '4px' }}></div>
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
      {/* 4 Core metrics counters */}
      <div className="metric-row">
        <div className="metric-card glass">
          <div className="metric-card-info">
            <h3>Total Jobs Posted</h3>
            <p>{jobs.length}</p>
          </div>
          <div className="metric-card-icon"><Briefcase size={22} /></div>
        </div>

        <div className="metric-card glass">
          <div className="metric-card-info">
            <h3>Active Applicants</h3>
            <p>{apps.length}</p>
          </div>
          <div className="metric-card-icon"><Users size={22} /></div>
        </div>

        <div className="metric-card glass">
          <div className="metric-card-info">
            <h3>Shortlisted Candidates</h3>
            <p>{shortlistedCount}</p>
          </div>
          <div className="metric-card-icon"><Award size={22} /></div>
        </div>

        <div className="metric-card glass">
          <div className="metric-card-info">
            <h3>Hired Candidates</h3>
            <p>{hiredCount}</p>
          </div>
          <div className="metric-card-icon"><Check size={22} /></div>
        </div>
      </div>

      <div className="widget-grid">
        
        {/* Top matching scores chart list */}
        <div className="widget glass" style={{ gridColumn: 'span 7' }}>
          <h3 className="widget-title">Top Ranking Applicants</h3>
          <div className="ranking-table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role Applied</th>
                  <th>ATS Match</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...apps]
                  .sort((a, b) => b.atsScore - a.atsScore)
                  .slice(0, 4)
                  .map(app => (
                    <tr key={app.id}>
                      <td><strong>{app.candidate?.firstName} {app.candidate?.lastName}</strong></td>
                      <td>{app.job?.title}</td>
                      <td>
                        <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{app.atsScore}%</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${app.status.toLowerCase().replace('_', '')}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                      No candidate profile matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Jobs list inside metrics summary */}
        <div className="widget glass" style={{ gridColumn: 'span 5' }}>
          <h3 className="widget-title">Active Job Roles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.slice(0, 4).map(j => (
              <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{j.title}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📍 {j.location}</span>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                  {apps.filter(a => a.job?.id === j.id).length} Applicants
                </span>
              </div>
            ))}
            {jobs.length === 0 && (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                No active vacancy postings found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
