package com.hirehub.ats.service;

import com.hirehub.ats.model.*;
import com.hirehub.ats.repository.ApplicationRepository;
import com.hirehub.ats.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AtsScoringService atsScoringService;

    @Autowired
    private NotificationService notificationService;

    @Value("${upload.path}")
    private String uploadPath;

    public Application applyForJob(Job job, User candidate, MultipartFile resumeFile) throws IOException {
        if (applicationRepository.findByCandidateAndJob(candidate, job).isPresent()) {
            throw new IllegalArgumentException("You have already applied for this job");
        }

        File uploadFolder = new File(uploadPath);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        String originalFileName = resumeFile.getOriginalFilename();
        String savedFileName = UUID.randomUUID().toString() + "_" + originalFileName;
        Path filePath = Paths.get(uploadPath, savedFileName);
        Files.copy(resumeFile.getInputStream(), filePath);

        String parsedText = atsScoringService.extractTextFromPdf(filePath.toString());

        List<String> skills = atsScoringService.extractSkills(parsedText);
        String extractedSkillsStr = String.join(", ", skills);

        Resume resume = Resume.builder()
                .fileName(originalFileName)
                .filePath(filePath.toString())
                .extractedSkills(extractedSkillsStr)
                .build();
        resume = resumeRepository.save(resume);

        int score = atsScoringService.calculateAtsScore(skills, job.getRequiredSkills());

        Application application = Application.builder()
                .candidate(candidate)
                .job(job)
                .resume(resume)
                .atsScore(score)
                .status(ApplicationStatus.APPLIED)
                .rank(0)
                .appliedDate(java.time.LocalDate.now())
                .build();
        application = applicationRepository.save(application);

        recalculateRanksForJob(job);

        application = applicationRepository.findById(application.getId()).orElse(application);

        notificationService.sendNotification(job.getRecruiter(), 
                String.format("New candidate %s %s applied for '%s' with ATS score: %d%%.", 
                        candidate.getFirstName(), candidate.getLastName(), job.getTitle(), score));

        return application;
    }

    public void recalculateRanksForJob(Job job) {
        List<Application> apps = applicationRepository.findByJobOrderByAtsScoreDesc(job);
        for (int i = 0; i < apps.size(); i++) {
            Application app = apps.get(i);
            app.setRank(i + 1);
            applicationRepository.save(app);
        }
    }

    public List<Application> getApplicationsForJob(Job job, User recruiter) {
        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new IllegalArgumentException("You are not authorized to view applications for this job");
        }
        return applicationRepository.findByJobOrderByAtsScoreDesc(job);
    }

    public List<Application> getApplicationsByCandidate(User candidate) {
        return applicationRepository.findByCandidate(candidate);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
    }

    public Application updateApplicationStatus(Long id, ApplicationStatus status, User recruiter) {
        Application application = getApplicationById(id);
        Job job = application.getJob();

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this application");
        }

        application.setStatus(status);
        application = applicationRepository.save(application);

        notificationService.sendNotification(application.getCandidate(), 
                String.format("Your application for '%s' has been updated to status: %s.", 
                        job.getTitle(), status.name()));

        return application;
    }

    public List<Application> getApplicationsForRecruiter(User recruiter) {
        return applicationRepository.findByRecruiter(recruiter);
    }
}
