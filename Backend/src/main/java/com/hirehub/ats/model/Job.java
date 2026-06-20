package com.hirehub.ats.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "required_skills", columnDefinition = "TEXT", nullable = false)
    private String requiredSkills; // Comma separated list of skills

    @Column(nullable = false)
    private String location;

    private String salary;

    @Column(name = "company_name")
    private String companyName;

    private String experience;

    @Column(name = "employment_type")
    private String employmentType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;
}
