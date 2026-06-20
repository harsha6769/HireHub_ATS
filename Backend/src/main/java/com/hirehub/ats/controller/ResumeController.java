package com.hirehub.ats.controller;

import com.hirehub.ats.model.Resume;
import com.hirehub.ats.model.User;
import com.hirehub.ats.model.Role;
import com.hirehub.ats.security.CustomUserDetails;
import com.hirehub.ats.repository.ResumeRepository;
import com.hirehub.ats.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        boolean authorized = false;
        if (user.getRole() == Role.RECRUITER) {
            authorized = applicationRepository.existsByResumeIdAndJobRecruiterId(id, user.getId());
        } else if (user.getRole() == Role.CANDIDATE) {
            authorized = applicationRepository.existsByResumeIdAndCandidateId(id, user.getId());
        }

        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        try {
            Path path = Paths.get(resume.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resume.getFileName() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file!");
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> viewResume(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        boolean authorized = false;
        if (user.getRole() == Role.RECRUITER) {
            authorized = applicationRepository.existsByResumeIdAndJobRecruiterId(id, user.getId());
        } else if (user.getRole() == Role.CANDIDATE) {
            authorized = applicationRepository.existsByResumeIdAndCandidateId(id, user.getId());
        }

        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        try {
            Path path = Paths.get(resume.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resume.getFileName() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file!");
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
