package com.hirehub.ats.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "extracted_skills", columnDefinition = "TEXT")
    private String extractedSkills; // Comma separated list of skills
}
