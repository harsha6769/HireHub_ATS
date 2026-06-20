import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Upload, Briefcase, RefreshCw, X } from 'lucide-react';

const JobsListing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Uploader & simulation state
  const [uploadJobId, setUploadJobId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(-1);
  const [screeningResult, setScreeningResult] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      setErrorMessage('Failed to fetch jobs. Please verify your backend server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = (jobId) => {
    if (!isAuthenticated) {
      alert('Please log in as a candidate to apply for jobs.');
      navigate('/candidate/login');
      return;
    }
    if (user.role !== 'CANDIDATE') {
      alert('Only candidate accounts can submit resumes for job listings.');
      return;
    }
    setUploadJobId(jobId);
    document.getElementById('file-upload-input').click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }

    setIsUploading(true);
    setUploadStep(0);

    // Simulate animated extraction pipeline matching the required steps:
    // Upload Resume -> Resume Parsing -> Skill Extraction -> JD Matching -> ATS Score -> Candidate Ranking -> Recruiter Review
    const steps = [
      'Uploading Resume...',
      'Resume Parsing...',
      'Skill Extraction...',
      'JD Matching...',
      'ATS Score Generation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setUploadStep(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Now call the actual backend API
    const formData = new FormData();
    formData.append('jobId', uploadJobId);
    formData.append('resume', file);

    try {
      const res = await api.post('/applications/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const appData = res.data;
      
      // Compute matches and missing skills from real DB strings
      const requiredStr = appData.job?.requiredSkills || '';
      const extractedStr = appData.resume?.extractedSkills || '';
      
      const reqList = requiredStr.split(',').map(s => s.trim()).filter(Boolean);
      const extList = extractedStr.split(',').map(s => s.trim()).filter(Boolean);
      
      const matched = reqList.filter(req => 
        extList.some(ext => ext.toLowerCase().includes(req.toLowerCase()))
      );
      
      const missing = reqList.filter(req => 
        !extList.some(ext => ext.toLowerCase().includes(req.toLowerCase()))
      );

      setScreeningResult({
        atsScore: appData.atsScore,
        fileName: appData.resume?.fileName || file.name,
        jobTitle: appData.job?.title || 'Selected Role',
        matchedSkills: matched,
        missingSkills: missing
      });

      alert(`Application successfully submitted! Match Score: ${appData.atsScore}%`);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to submit application.');
    } finally {
      setIsUploading(false);
      setUploadStep(-1);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', flex: 1, width: '100%' }}>
      <h2 className="section-title">Open Opportunities</h2>
      <p className="section-subtitle" style={{ marginBottom: '32px' }}>
        Find vacancies, upload your PDF resume, and evaluate your matching ranking score.
      </p>

      {errorMessage && (
        <div className="widget glass" style={{ borderColor: '#ef4444', color: '#f87171', marginBottom: '24px' }}>
          {errorMessage}
        </div>
      )}

      {/* Screen Result Card */}
      {screeningResult && (
        <div className="widget glass" style={{ marginBottom: '32px', borderColor: 'var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '4px' }}>Evaluation Complete</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Your resume <strong>{screeningResult.fileName}</strong> has been successfully ranked.
              </p>
            </div>
            <button className="close-btn" onClick={() => setScreeningResult(null)}><X size={18} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '24px', marginTop: '20px', alignItems: 'center' }}>
            <div className="ats-score-display">
              <svg width="120" height="120" className="circular-progress-svg">
                <circle cx="60" cy="60" r="48" className="circular-bg" />
                <circle cx="60" cy="60" r="48" className="circular-fill" 
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - screeningResult.atsScore / 100)} 
                />
              </svg>
              <span className="ats-score-value" style={{ fontSize: '1.75rem' }}>{screeningResult.atsScore}%</span>
            </div>

            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px' }}>ATS Match Profile for {screeningResult.jobTitle}:</p>
              
              <div className="skills-tags" style={{ margin: 0 }}>
                {screeningResult.matchedSkills.map(s => (
                  <span key={s} className="skill-tag skill-matched">{s}</span>
                ))}
                {screeningResult.missingSkills.map(s => (
                  <span key={s} className="skill-tag skill-missing">{s}</span>
                ))}
              </div>
              
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
                {screeningResult.missingSkills.length > 0 
                  ? `💡 Tip: Update your resume qualifications to cover missing keyword requirements to increase your score.`
                  : `🚀 Excellent! Profile qualifications match 100% of core JD tags.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Screen Loader Card */}
      {isUploading && (
        <div className="widget glass" style={{ marginBottom: '32px', textAlign: 'center', padding: '40px' }}>
          <RefreshCw className="workflow-arrow" size={36} style={{ animation: 'spin 2s linear infinite', marginInline: 'auto', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px' }}>Screening Resume Pipeline</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {['Upload', 'Parsing', 'Extraction', 'JD Match', 'Scoring'].map((step, idx) => (
              <span key={step} className="skill-tag" style={{
                background: idx <= uploadStep ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.02)',
                color: idx <= uploadStep ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: idx <= uploadStep ? '1px solid var(--accent-purple)' : '1px solid transparent'
              }}>
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="jobs-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="job-card glass" style={{ minHeight: '320px', height: 'auto' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '60%' }}>
                    <div className="skeleton" style={{ height: '22px', width: '90%', marginBottom: '8px' }}></div>
                    <div className="skeleton" style={{ height: '14px', width: '60%' }}></div>
                  </div>
                  <div className="skeleton" style={{ height: '22px', width: '75px', borderRadius: '6px' }}></div>
                </div>
                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '70%' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', alignItems: 'center' }}>
                <div className="skeleton" style={{ height: '14px', width: '140px' }}></div>
                <div className="skeleton" style={{ height: '36px', width: '120px', borderRadius: '8px' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card glass">
              <div>
                <div className="job-header">
                  <div>
                    <h3 className="job-role">{job.title}</h3>
                    <span className="job-company">{job.companyName || 'HireHub Network'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span className="job-salary-tag">{job.salary}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                      {job.employmentType || 'Full-time'}
                    </span>
                  </div>
                </div>
                <p className="job-desc">{job.description}</p>
              </div>

              <div className="job-footer">
                <div className="job-metadata" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span>📍 {job.location}</span>
                    <span>💼 {job.experience || 'Not specified'}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Required: <strong>{job.requiredSkills}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setSelectedJobDetail(job)} style={{ padding: '8px 12px' }}>
                    View Details
                  </button>
                  <button className="btn btn-primary" onClick={() => handleApplyClick(job.id)} style={{ padding: '8px 16px' }}>
                    <Upload size={14} /> Apply & Screen
                  </button>
                </div>
              </div>
            </div>
          ))}
          {jobs.length === 0 && !errorMessage && (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: 'span 3' }}>No active vacancies published.</p>
          )}
        </div>
      )}

      {selectedJobDetail && (
        <div className="modal-overlay" onClick={() => setSelectedJobDetail(null)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%', padding: '32px', marginInline: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{selectedJobDetail.title}</h2>
                <p style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{selectedJobDetail.companyName || 'HireHub Network'}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedJobDetail(null)}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
              <div>📍 <strong>Location:</strong> {selectedJobDetail.location}</div>
              <div>💼 <strong>Experience:</strong> {selectedJobDetail.experience || 'Not specified'}</div>
              <div>💵 <strong>Salary:</strong> {selectedJobDetail.salary || 'Not specified'}</div>
              <div>⏰ <strong>Type:</strong> {selectedJobDetail.employmentType || 'Full-time'}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Job Description</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {selectedJobDetail.description}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Required Skills</h4>
              <div className="skills-tags" style={{ margin: 0 }}>
                {selectedJobDetail.requiredSkills.split(',').map(skill => (
                  <span key={skill} className="skill-tag" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-purple)' }}>{skill.trim()}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedJobDetail(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { handleApplyClick(selectedJobDetail.id); setSelectedJobDetail(null); }}>
                <Upload size={14} /> Apply with Resume
              </button>
            </div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        id="file-upload-input" 
        className="hidden-file-input" 
        accept=".pdf" 
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default JobsListing;
