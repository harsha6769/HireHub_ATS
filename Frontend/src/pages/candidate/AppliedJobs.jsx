import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw } from 'lucide-react';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get('/applications/candidate');
      setApplications(res.data);
    } catch (err) {
      setErrorMessage('Failed to fetch applications. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="widget glass">
        <div className="skeleton" style={{ height: '22px', width: '220px', marginBottom: '32px' }}></div>
        {[1, 2].map(i => (
          <div key={i} style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ width: '50%' }}>
                <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '6px' }}></div>
                <div className="skeleton" style={{ height: '12px', width: '60%' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="skeleton" style={{ height: '18px', width: '100px' }}></div>
                <div className="skeleton" style={{ height: '24px', width: '90px', borderRadius: '20px' }}></div>
              </div>
            </div>
            
            {/* Timeline Nodes Skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', padding: '0 10px' }}>
              {[1, 2, 3, 4, 5].map(dot => (
                <div key={dot} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="skeleton" style={{ height: '22px', width: '22px', borderRadius: '50%', marginBottom: '8px' }}></div>
                  <div className="skeleton" style={{ height: '12px', width: '60px' }}></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="widget glass">
      <h3 className="widget-title">Applications & Timelines</h3>
      
      {errorMessage && (
        <div style={{ color: '#f87171', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      {applications.length > 0 ? (
        applications.map(app => {
          const stages = app.status === 'REJECTED'
            ? ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'REJECTED']
            : ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'HIRED'];
          const activeIndex = stages.indexOf(app.status);
          
          return (
            <div key={app.id} style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '32px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{app.job?.title}</h4>
                  <span style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 'bold' }}>Company Partner</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {app.job?.location} • CV: {app.resume?.fileName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="score-badge" style={{ fontSize: '1.1rem', marginRight: '16px', color: app.atsScore >= 80 ? '#4ade80' : '#fbbf24' }}>
                    ATS Match: {app.atsScore}%
                  </span>
                  <span className={`status-pill status-${app.status.toLowerCase().replace('_', '')}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Dynamic Status timeline */}
              <div className="timeline-container">
                <div className="timeline-line"></div>
                <div className="timeline-progress-line" style={{ 
                  width: `${activeIndex === -1 ? 0 : (activeIndex / (stages.length - 1)) * 100}%` 
                }}></div>
                
                {stages.map((stage, idx) => {
                  let label = stage.replace('_', ' ');
                  let nodeClass = '';
                  if (idx < activeIndex || app.status === 'HIRED') nodeClass = 'completed';
                  else if (idx === activeIndex) nodeClass = 'active';
                  
                  return (
                    <div key={stage} className={`timeline-node ${nodeClass}`}>
                      <div className="timeline-dot" style={{
                        backgroundColor: app.status === 'REJECTED' && idx === activeIndex ? '#f87171' : '',
                        borderColor: app.status === 'REJECTED' && idx === activeIndex ? '#ef4444' : ''
                      }}></div>
                      <span className="timeline-label">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
          You haven't submitted any resume applications yet.
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
