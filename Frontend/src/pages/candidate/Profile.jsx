import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const Profile = () => {
  const [skills, setSkills] = useState(['React', 'JavaScript', 'CSS', 'HTML5', 'Java']);
  const [inputSkill, setInputSkill] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('candidate_skills');
    if (saved) {
      try {
        setSkills(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse skills from local storage', e);
      }
    }
  }, []);

  const saveSkills = (newSkills) => {
    setSkills(newSkills);
    localStorage.setItem('candidate_skills', JSON.stringify(newSkills));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && inputSkill.trim()) {
      e.preventDefault();
      const cleaned = inputSkill.trim();
      if (!skills.includes(cleaned)) {
        const updated = [...skills, cleaned];
        saveSkills(updated);
      }
      setInputSkill('');
    }
  };

  const handleAddClick = () => {
    const cleaned = inputSkill.trim();
    if (cleaned && !skills.includes(cleaned)) {
      const updated = [...skills, cleaned];
      saveSkills(updated);
    }
    setInputSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    saveSkills(updated);
  };

  return (
    <div className="widget glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 className="widget-title">Manage Profile Skills</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Configure your qualifications. These skills are automatically matched against job posts during resume screening to evaluate your score.
      </p>

      <div className="skills-tags" style={{ marginBottom: '32px' }}>
        {skills.map(skill => (
          <span key={skill} className="skill-tag skill-matched" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            {skill} <X size={14} style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)} />
          </span>
        ))}
        {skills.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills configured. Add some skills below.</p>
        )}
      </div>

      <div className="form-group" style={{ maxWidth: '500px' }}>
        <label className="form-label">Add a Skill Tag</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Type skill tag (e.g. AWS, Python, Kubernetes) and press Enter" 
            value={inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            onKeyDown={handleAddSkill}
          />
          <button type="button" className="btn btn-primary" onClick={handleAddClick} style={{ padding: '0 20px' }}>
            <Plus size={18} />
          </button>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
          💡 Tip: Make sure tags match keywords in job requirements to score higher.
        </span>
      </div>
    </div>
  );
};

export default Profile;
