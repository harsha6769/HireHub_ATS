package com.hirehub.ats.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AtsScoringService {

    private static final List<String> SKILL_CATALOG = Arrays.asList(
            "Java", "Spring Boot", "Spring", "MySQL", "React", "Git", "GitHub", 
            "Python", "Docker", "Kubernetes", "AWS", "Azure", "C++", "C#", 
            "Javascript", "HTML", "CSS", "TypeScript", "Node.js", "Angular", 
            "Go", "Golang", "Rust", "Ruby", "PHP", "Hibernate", "JPA", 
            "REST API", "Microservices", "PostgreSQL", "MongoDB", "Oracle", 
            "Redis", "Elasticsearch", "Maven", "Gradle", "CI/CD", "Jenkins", 
            "Linux", "Kotlin", "Swift", "C", "SQL", "NoSQL"
    );

    public String extractTextFromPdf(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("Resume PDF file not found at path: " + filePath);
        }
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        }
    }

    public List<String> extractSkills(String text) {
        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<String> matchedSkills = new ArrayList<>();
        String normalizedText = text.toLowerCase();

        for (String skill : SKILL_CATALOG) {
            String skillLower = skill.toLowerCase();
            // Use word boundary check for short skills to prevent substring false-positives (e.g. 'Go' in 'Google')
            if (skill.length() < 4) {
                String escapedSkill = Pattern.quote(skillLower);
                Pattern pattern = Pattern.compile("\\b" + escapedSkill + "\\b");
                if (pattern.matcher(normalizedText).find()) {
                    matchedSkills.add(skill);
                }
            } else {
                if (normalizedText.contains(skillLower)) {
                    matchedSkills.add(skill);
                }
            }
        }
        return matchedSkills;
    }

    public int calculateAtsScore(List<String> candidateSkills, String requiredSkillsStr) {
        if (requiredSkillsStr == null || requiredSkillsStr.trim().isEmpty()) {
            return 100;
        }

        List<String> requiredSkills = Arrays.stream(requiredSkillsStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (requiredSkills.isEmpty()) {
            return 100;
        }

        List<String> candidateSkillsLower = candidateSkills.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        long matchCount = requiredSkills.stream()
                .filter(reqSkill -> candidateSkillsLower.stream().anyMatch(candSkill -> candSkill.contains(reqSkill) || reqSkill.contains(candSkill)))
                .count();

        return (int) Math.round(((double) matchCount / requiredSkills.size()) * 100);
    }
}
