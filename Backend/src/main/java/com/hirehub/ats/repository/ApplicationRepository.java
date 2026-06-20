package com.hirehub.ats.repository;

import com.hirehub.ats.model.Application;
import com.hirehub.ats.model.Job;
import com.hirehub.ats.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidate(User candidate);
    List<Application> findByJob(Job job);
    List<Application> findByJobOrderByAtsScoreDesc(Job job);
    Optional<Application> findByCandidateAndJob(User candidate, Job job);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter = :recruiter ORDER BY a.atsScore DESC")
    List<Application> findByRecruiter(@Param("recruiter") User recruiter);

    @Query("SELECT COUNT(a) > 0 FROM Application a WHERE a.resume.id = :resumeId AND a.job.recruiter.id = :recruiterId")
    boolean existsByResumeIdAndJobRecruiterId(@Param("resumeId") Long resumeId, @Param("recruiterId") Long recruiterId);

    @Query("SELECT COUNT(a) > 0 FROM Application a WHERE a.resume.id = :resumeId AND a.candidate.id = :candidateId")
    boolean existsByResumeIdAndCandidateId(@Param("resumeId") Long resumeId, @Param("candidateId") Long candidateId);
}
