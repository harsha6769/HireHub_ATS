package com.hirehub.ats.controller;

import com.hirehub.ats.model.Job;
import com.hirehub.ats.model.User;
import com.hirehub.ats.security.CustomUserDetails;
import com.hirehub.ats.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        try {
            User recruiter = getAuthenticatedUser();
            Job created = jobService.createJob(job, recruiter);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job job) {
        try {
            User recruiter = getAuthenticatedUser();
            Job updated = jobService.updateJob(id, job, recruiter);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            User recruiter = getAuthenticatedUser();
            jobService.deleteJob(id, recruiter);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(jobService.getAllJobs(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/recruiter")
    public ResponseEntity<?> getJobsByRecruiter() {
        try {
            User recruiter = getAuthenticatedUser();
            return ResponseEntity.ok(jobService.getJobsByRecruiter(recruiter));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
