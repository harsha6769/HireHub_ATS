import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, Users, Award, Upload, Search, Bell, Calendar, BarChart2 } from 'lucide-react';

const LandingPage = () => {
  const [liveJobsCount, setLiveJobsCount] = useState(0);

  // Counter stats state
  const [statRecruiters, setStatRecruiters] = useState(0);
  const [statCandidates, setStatCandidates] = useState(0);
  const [statJobs, setStatJobs] = useState(0);
  const [statHires, setStatHires] = useState(0);

  useEffect(() => {
    // Fetch live jobs to count them dynamically
    api.get('/jobs')
      .then(res => {
        if (Array.isArray(res.data)) {
          setLiveJobsCount(res.data.length);
        }
      })
      .catch(err => console.log('Live jobs fetch failed on landing page', err));
  }, []);

  // Animate counters on load
  useEffect(() => {
    const duration = 1200; // ms
    const steps = 50;
    const stepTime = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setStatRecruiters(Math.floor((80 / steps) * currentStep));
      setStatCandidates(Math.floor((3400 / steps) * currentStep));
      setStatJobs(Math.max(liveJobsCount, Math.floor((15 / steps) * currentStep)));
      setStatHires(Math.floor((720 / steps) * currentStep));
      
      if (currentStep >= steps) {
        setStatRecruiters(85);
        setStatCandidates(3452);
        setStatJobs(liveJobsCount || 18);
        setStatHires(728);
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [liveJobsCount]);

  return (
    <div>
      <header className="hero-section">
        <h1 className="hero-heading text-gradient">HireHub ATS</h1>
        <p className="hero-subtitle">
          Intelligent Resume Screening & Recruitment Platform. Elevate your talent search with instant parsing and visual match analysis.
        </p>
        <div className="hero-ctas">
          <Link to="/jobs" className="btn btn-primary">
            <Briefcase size={18} /> Find Jobs
          </Link>
          <Link to="/recruiter/login" className="btn btn-secondary">
            <Users size={18} /> Recruit Talent
          </Link>
        </div>
      </header>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card glass">
            <p className="stat-number">{statCandidates}+</p>
            <p className="stat-label">Total Candidates</p>
          </div>
          <div className="stat-card glass">
            <p className="stat-number">{statRecruiters}+</p>
            <p className="stat-label">Total Recruiters</p>
          </div>
          <div className="stat-card glass">
            <p className="stat-number">{statJobs}</p>
            <p className="stat-label">Total Active Jobs</p>
          </div>
          <div className="stat-card glass">
            <p className="stat-number">{statHires}+</p>
            <p className="stat-label">Total Hires</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Automated Hiring Infrastructure</h2>
        <p className="section-subtitle">A modern toolkit built to parse resumes and match candidates effortlessly.</p>
        
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon-wrapper"><Upload size={20} /></div>
            <h3 className="feature-title">Resume Parsing</h3>
            <p className="feature-desc">Automated extraction of details and keywords from PDF resume attachments.</p>
          </div>
          
          <div className="feature-card glass">
            <div className="feature-icon-wrapper"><Award size={20} /></div>
            <h3 className="feature-title">ATS Score Generation</h3>
            <p className="feature-desc">Analyzes candidates against vacancy requirements to calculate an immediate score percentage.</p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon-wrapper"><Users size={20} /></div>
            <h3 className="feature-title">Candidate Ranking</h3>
            <p className="feature-desc">Positions applicant profiles automatically according to their keyword match score.</p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon-wrapper"><BarChart2 size={20} /></div>
            <h3 className="feature-title">Recruiter Dashboard</h3>
            <p className="feature-desc">Post jobs, edit descriptions, track candidate status, and view analytics in one spot.</p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon-wrapper"><Briefcase size={20} /></div>
            <h3 className="feature-title">Job Management</h3>
            <p className="feature-desc">Sleek forms allow immediate publication, status toggles, and updates to requirements.</p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon-wrapper"><Bell size={20} /></div>
            <h3 className="feature-title">Real-time Notifications</h3>
            <p className="feature-desc">Alerts users of shortlists, new interviews, scheduling dates, and selection status.</p>
          </div>
        </div>
      </section>

      {/* ATS Workflow */}
      <section className="workflow-section">
        <h2 className="section-title">Workflow Pipeline</h2>
        <p className="section-subtitle">Understand how candidate profiles proceed through our parsing algorithms.</p>
        
        <div className="workflow-container glass">
          <div className="workflow-step active">Upload Resume</div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step active">Resume Parsing</div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step active">Skill Extraction</div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step active">JD Matching</div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step active">ATS Score</div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step">Candidate Ranking</div>
          <div className="workflow-arrow">↓</div>
          <div className="workflow-step">Recruiter Review</div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
