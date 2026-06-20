import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { RefreshCw, Trash2, Edit3 } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appsCount, setAppsCount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const jobRes = await api.get('/jobs/recruiter');
      const recruiterJobs = jobRes.data;
      setJobs(recruiterJobs);

      // Fetch candidates counts per job
      const counts = {};
      for (const job of recruiterJobs) {
        try {
          const appRes = await api.get(`/applications/job/${job.id}`);
          counts[job.id] = Array.isArray(appRes.data) ? appRes.data.length : 0;
        } catch (e) {
          counts[job.id] = 0;
        }
      }
      setAppsCount(counts);
    } catch (err) {
      setErrorMessage('Failed to fetch job postings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
      alert('Job posting deleted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to delete job.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <RefreshCw style={{ animation: 'spin 2s linear infinite', color: '#8b5cf6', marginBottom: '16px' }} size={32} />
        <p>Loading your vacancy postings...</p>
      </div>
    );
  }

  return (
    <div className="widget glass">
      <h3 className="widget-title">Active Vacancies</h3>

      {errorMessage && (
        <div style={{ color: '#f87171', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}

      <div className="ranking-table-container">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Candidates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td><strong>{j.title}</strong></td>
                <td>{j.companyName || 'HireHub Network'}</td>
                <td>{j.location}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                    {j.employmentType || 'Full-time'}
                  </span>
                </td>
                <td>{j.experience || 'Not specified'}</td>
                <td>{j.salary}</td>
                <td><strong>{appsCount[j.id] || 0}</strong></td>
                 <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link 
                      to={`/recruiter/edit-job/${j.id}`} 
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={12} /> Edit
                    </Link>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => handleDeleteJob(j.id)}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && !errorMessage && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
                  No jobs posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
