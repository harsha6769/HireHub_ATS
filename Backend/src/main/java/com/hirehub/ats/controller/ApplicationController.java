package com.hirehub.ats.controller;

import com.hirehub.ats.model.*;
import com.hirehub.ats.security.CustomUserDetails;
import com.hirehub.ats.service.ApplicationService;
import com.hirehub.ats.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private JobService jobService;

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    @PostMapping(value = "/apply", consumes = "multipart/form-data")
    public ResponseEntity<?> applyForJob(
            @RequestParam("jobId") Long jobId,
            @RequestParam("resume") MultipartFile resumeFile) {
        try {
            User candidate = getAuthenticatedUser();
            Job job = jobService.getJobById(jobId);
            Application application = applicationService.applyForJob(job, candidate, resumeFile);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/candidate")
    public ResponseEntity<?> getApplicationsByCandidate() {
        try {
            User candidate = getAuthenticatedUser();
            List<Application> apps = applicationService.getApplicationsByCandidate(candidate);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/recruiter")
    public ResponseEntity<?> getApplicationsForRecruiter() {
        try {
            User recruiter = getAuthenticatedUser();
            List<Application> apps = applicationService.getApplicationsForRecruiter(recruiter);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsForJob(@PathVariable Long jobId) {
        try {
            User recruiter = getAuthenticatedUser();
            Job job = jobService.getJobById(jobId);
            List<Application> apps = applicationService.getApplicationsForJob(job, recruiter);
            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam("status") ApplicationStatus status) {
        try {
            User recruiter = getAuthenticatedUser();
            Application updated = applicationService.updateApplicationStatus(id, status, recruiter);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
