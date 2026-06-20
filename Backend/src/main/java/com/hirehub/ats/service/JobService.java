package com.hirehub.ats.service;

import com.hirehub.ats.model.Job;
import com.hirehub.ats.model.User;
import com.hirehub.ats.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public Job createJob(Job job, User recruiter) {
        job.setRecruiter(recruiter);
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updatedJob, User recruiter) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!existingJob.getRecruiter().getId().equals(recruiter.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this job");
        }

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setDescription(updatedJob.getDescription());
        existingJob.setRequiredSkills(updatedJob.getRequiredSkills());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setSalary(updatedJob.getSalary());
        existingJob.setCompanyName(updatedJob.getCompanyName());
        existingJob.setExperience(updatedJob.getExperience());
        existingJob.setEmploymentType(updatedJob.getEmploymentType());

        return jobRepository.save(existingJob);
    }

    public void deleteJob(Long id, User recruiter) {
        Job existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!existingJob.getRecruiter().getId().equals(recruiter.getId())) {
            throw new IllegalArgumentException("You are not authorized to delete this job");
        }

        jobRepository.delete(existingJob);
    }

    public List<Job> getAllJobs(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return jobRepository.searchJobs(query.trim());
        }
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public List<Job> getJobsByRecruiter(User recruiter) {
        return jobRepository.findByRecruiter(recruiter);
    }
}
