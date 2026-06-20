import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import CandidateLogin from '../pages/public/CandidateLogin';
import RecruiterLogin from '../pages/public/RecruiterLogin';
import Register from '../pages/public/Register';
import CandidateRegister from '../pages/public/CandidateRegister';
import RecruiterRegister from '../pages/public/RecruiterRegister';
import JobsListing from '../pages/public/JobsListing';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/Dashboard';
import CandidateProfile from '../pages/candidate/Profile';
import CandidateAppliedJobs from '../pages/candidate/AppliedJobs';
import CandidateNotifications from '../pages/candidate/Notifications';

// Recruiter Pages
import RecruiterDashboard from '../pages/recruiter/Dashboard';
import RecruiterCreateJob from '../pages/recruiter/CreateJob';
import RecruiterManageJobs from '../pages/recruiter/ManageJobs';
import RecruiterEditJob from '../pages/recruiter/EditJob';
import RecruiterApplicants from '../pages/recruiter/Applicants';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsListing />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
      </Route>

      {/* Candidate Routes inside DashboardLayout */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute allowedRoles={['CANDIDATE']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CandidateDashboard />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="applications" element={<CandidateAppliedJobs />} />
        <Route path="notifications" element={<CandidateNotifications />} />
      </Route>

      {/* Recruiter Routes inside DashboardLayout */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={['RECRUITER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RecruiterDashboard />} />
        <Route path="create-job" element={<RecruiterCreateJob />} />
        <Route path="manage-jobs" element={<RecruiterManageJobs />} />
        <Route path="edit-job/:id" element={<RecruiterEditJob />} />
        <Route path="applicants" element={<RecruiterApplicants />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
