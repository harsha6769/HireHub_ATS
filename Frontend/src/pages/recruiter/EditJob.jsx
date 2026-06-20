import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { RefreshCw, Save } from 'lucide-react';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get(`/jobs/${id}`);
      const job = res.data;
      setTitle(job.title || '');
      setCompanyName(job.companyName || '');
      setLocation(job.location || '');
      setSalary(job.salary || '');
      setRequiredSkills(job.requiredSkills || '');
      setExperience(job.experience || '');
      setEmploymentType(job.employmentType || 'Full-time');
      setDescription(job.description || '');
    } catch (err) {
      setErrorMessage('Failed to load job details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !companyName || !description || !requiredSkills || !location || !experience || !employmentType) {
      alert('All fields except salary are required.');
      return;
    }

    setIsSaving(true);
    const jobData = {
      title,
      companyName,
      description,
      requiredSkills,
      experience,
      salary: salary || 'Negotiable',
      location,
      employmentType
    };

    try {
      await api.put(`/jobs/${id}`, jobData);
      alert('Job listing updated successfully!');
      navigate('/recruiter/manage-jobs');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to update job listing.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <RefreshCw style={{ animation: 'spin 2s linear infinite', color: '#8b5cf6', marginBottom: '16px' }} size={32} />
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="widget glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 className="widget-title">Edit Job Posting</h3>

      {errorMessage && (
        <div style={{ color: '#f87171', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', marginBottom: '20px' }}>
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Senior Backend Engineer" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
              disabled={isSaving}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Acme Corp" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required 
              disabled={isSaving}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Remote (US) or New York, NY" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required 
              disabled={isSaving}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Salary Estimation</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. $130,000 - $160,000" 
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Java, Spring Boot, MySQL, JPA" 
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              required 
              disabled={isSaving}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Experience Required</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 3+ Years" 
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required 
              disabled={isSaving}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select 
              className="form-input"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              required
              disabled={isSaving}
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Detailed Job Description</label>
          <textarea 
            className="form-input" 
            rows="6" 
            placeholder="Outline responsibilities, day-to-day duties, and required/optional tech qualifications..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isSaving}
            style={{ resize: 'vertical', fontFamily: 'var(--sans)' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 2s linear infinite' }} /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/recruiter/manage-jobs')} disabled={isSaving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
