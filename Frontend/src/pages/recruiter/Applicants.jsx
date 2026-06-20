import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RefreshCw, Eye, FileText, Download, ExternalLink, Check, AlertCircle } from 'lucide-react';

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Selected Detail Panel state
  const [selectedApp, setSelectedApp] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    fetchJobsAndApplicants();
  }, []);

  const fetchJobsAndApplicants = async () => {
    setIsLoading(true);
    try {
      const jobRes = await api.get('/jobs/recruiter');
      const recruiterJobs = jobRes.data;
      setJobs(recruiterJobs);
      await fetchApplications(recruiterJobs, 'all');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async (recruiterJobs, jobIdFilter) => {
    let allApps = [];
    if (jobIdFilter === 'all') {
      try {
        const appRes = await api.get('/applications/recruiter');
        allApps = Array.isArray(appRes.data) ? appRes.data : [];
      } catch (e) {
        console.error('Failed to fetch recruiter applications', e);
      }
    } else {
      const jobsToQuery = recruiterJobs.filter(j => j.id === parseInt(jobIdFilter));
      for (const job of jobsToQuery) {
        try {
          const appRes = await api.get(`/applications/job/${job.id}`);
          if (Array.isArray(appRes.data)) {
            allApps = [...allApps, ...appRes.data];
          }
        } catch (e) {
          console.error(`Failed to fetch for job ${job.id}`, e);
        }
      }
    }
    // Sort applications by ATS score descending
    allApps.sort((a, b) => b.atsScore - a.atsScore);
    setApps(allApps);
  };

  const handleJobFilterChange = async (e) => {
    const selected = e.target.value;
    setSelectedJobId(selected);
    setIsLoading(true);
    await fetchApplications(jobs, selected);
    setIsLoading(false);
    setSelectedApp(null);
    setPdfUrl(null);
  };

  // Securely fetch PDF file using Authorization headers to render inside the iframe
  const fetchPdfBlob = async (resumeId) => {
    if (!resumeId) return;
    setIsPdfLoading(true);
    setPdfUrl(null);
    try {
      const res = await api.get(`/resumes/view/${resumeId}`, {
        responseType: 'blob'
      });
      const localUrl = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      setPdfUrl(localUrl);
    } catch (err) {
      console.error('Failed to retrieve PDF blob securely', err);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadResume = async (resumeId, fileName) => {
    if (!resumeId) return;
    try {
      const res = await api.get(`/resumes/download/${resumeId}`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data]);
      const localUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = localUrl;
      link.setAttribute('download', fileName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error('Failed to download resume securely', err);
      alert('Failed to download resume.');
    }
  };

  const handleReviewClick = (app) => {
    setSelectedApp(app);
    fetchPdfBlob(app.resume?.id);
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status?status=${newStatus}`);
      // Refresh local list
      const updated = apps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
      setApps(updated);
      
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      alert('Application status updated successfully.');
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Helper keyword calculator
  const computeSkills = (app) => {
    const requiredStr = app.job?.requiredSkills || '';
    const extractedStr = app.resume?.extractedSkills || '';
    
    const reqList = requiredStr.split(',').map(s => s.trim()).filter(Boolean);
    const extList = extractedStr.split(',').map(s => s.trim()).filter(Boolean);
    
    const matched = reqList.filter(req => 
      extList.some(ext => ext.toLowerCase().includes(req.toLowerCase()))
    );
    const missing = reqList.filter(req => 
      !extList.some(ext => ext.toLowerCase().includes(req.toLowerCase()))
    );

    return { extList, matched, missing };
  };

  // Status visual filtering
  const filteredApps = apps.filter(a => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%', alignItems: 'flex-start' }}>
      
      {/* Left Pane: Table (60% width on large screens) */}
      <div className="widget glass" style={{ flex: '1 1 58%', minWidth: '320px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 className="widget-title" style={{ margin: 0 }}>Applicants Rankings Database</h3>
          
          {/* Dropdown Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select 
              className="form-select" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              value={selectedJobId}
              onChange={handleJobFilterChange}
            >
              <option value="all">All Postings</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>

            <select 
              className="form-select" 
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="REJECTED">Rejected</option>
              <option value="HIRED">Hired</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-glass)' }}>
                <div className="skeleton" style={{ height: '24px', width: '28px', borderRadius: '50%' }}></div>
                <div style={{ width: '25%' }}>
                  <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '6px' }}></div>
                  <div className="skeleton" style={{ height: '10px', width: '40%' }}></div>
                </div>
                <div className="skeleton" style={{ height: '14px', width: '120px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '45px' }}></div>
                <div className="skeleton" style={{ height: '22px', width: '80px', borderRadius: '20px' }}></div>
                <div className="skeleton" style={{ height: '32px', width: '100px', borderRadius: '8px' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ranking-table-container">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th>Resume PDF</th>
                  <th>Applied Date</th>
                  <th>Current Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, index) => {
                  return (
                    <tr 
                      key={app.id} 
                      className={selectedApp?.id === app.id ? 'active-row' : ''}
                      style={{ 
                        cursor: 'pointer',
                        background: selectedApp?.id === app.id ? 'rgba(99, 102, 241, 0.05)' : ''
                      }}
                      onClick={() => handleReviewClick(app)}
                    >
                      <td>
                        <div className="candidate-name-cell">
                          <strong>{app.candidate?.firstName} {app.candidate?.lastName}</strong>
                          <span className="candidate-subtext">Rank: #{index + 1} ({app.job?.title})</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.candidate?.email}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                          <FileText size={12} /> {app.resume?.fileName.substring(0, 15)}...
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{app.appliedDate || 'June 18, 2026'}</td>
                      <td>
                        <span className={`status-pill status-${app.status.toLowerCase().replace('_', '')}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); handleReviewClick(app); }}>
                          <Eye size={12} /> Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                      No candidates matched your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Pane: Split-pane side preview (40% width on large screens) */}
      <div className="widget glass" style={{ flex: '1 1 38%', minWidth: '300px', padding: '24px', alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
        {selectedApp ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{selectedApp.candidate?.firstName} {selectedApp.candidate?.lastName}</h3>
                <span className="score-badge" style={{ fontSize: '1.2rem', color: selectedApp.atsScore >= 80 ? '#4ade80' : '#fbbf24' }}>
                  {selectedApp.atsScore}% Match
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📧 {selectedApp.candidate?.email}
              </p>
            </div>

            {/* Actions & Status Dropdown */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Update Application Status</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  className="form-select"
                  style={{ flex: 1, padding: '8px' }}
                  value={selectedApp.status}
                  onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="HIRED">Hired</option>
                </select>
                
                <button 
                  onClick={() => handleDownloadResume(selectedApp.resume?.id, selectedApp.resume?.fileName)}
                  className="btn btn-secondary" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px' }}
                  title="Download Resume PDF"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </div>

            {/* Skills Keywords analysis */}
            {(() => {
              const { extList, matched, missing } = computeSkills(selectedApp);
              return (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>Skill Match Analysis</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#4ade80', display: 'block', marginBottom: '4px' }}>Matched Keywords ({matched.length})</span>
                      <div className="skills-tags" style={{ margin: 0 }}>
                        {matched.map(s => <span key={s} className="skill-tag skill-matched" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#f87171', display: 'block', marginBottom: '4px' }}>Missing Keywords ({missing.length})</span>
                      <div className="skills-tags" style={{ margin: 0 }}>
                        {missing.map(s => <span key={s} className="skill-tag skill-missing" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>{s}</span>)}
                        {missing.length === 0 && <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓ None. 100% matched!</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Resume Preview */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>Resume PDF Secure Preview</h4>
              {isPdfLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, border: '1px dashed var(--border-glass)', borderRadius: '8px', padding: '40px' }}>
                  <RefreshCw style={{ animation: 'spin 2s linear infinite', color: 'var(--accent-cyan)' }} size={28} />
                  <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>Loading PDF content securely...</p>
                </div>
              ) : pdfUrl ? (
                <div style={{ flex: 1, position: 'relative', minHeight: '380px' }}>
                  <iframe 
                    src={pdfUrl} 
                    title="PDF Resume View" 
                    width="100%" 
                    height="100%" 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      border: '1px solid var(--border-glass)', 
                      borderRadius: '8px', 
                      background: '#fff' 
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, border: '1px dashed var(--border-glass)', borderRadius: '8px', padding: '40px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  <AlertCircle size={28} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.85rem' }}>Resume PDF preview not available.</p>
                  <span 
                    onClick={() => handleDownloadResume(selectedApp.resume?.id, selectedApp.resume?.fileName)} 
                    className="form-link" 
                    style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Download file instead
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 20px' }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Applicant Review Workbench</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', maxWidth: '280px' }}>
              Select a candidate from the ranking list to view their PDF resume, extract matching tags, and transition their application status.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Applicants;
