import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Plus, RefreshCw } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !companyName || !description || !requiredSkills || !location || !experience || !employmentType) {
      alert('All fields except salary are required.');
      return;
    }

    setIsLoading(true);
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
      await api.post('/jobs', jobData);
      alert('Vacancy description posted successfully!');
      navigate('/recruiter/manage-jobs');
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || 'Failed to post vacancy.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="widget glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 className="widget-title">Create New Job Description</h3>
      
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading}
            style={{ resize: 'vertical', fontFamily: 'var(--sans)' }}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw size={16} style={{ animation: 'spin 2s linear infinite' }} /> Publishing...
            </>
          ) : (
            <>
              <Plus size={18} /> Publish Vacancy
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
