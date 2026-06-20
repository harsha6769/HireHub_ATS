package com.hirehub.ats.config;

import com.hirehub.ats.model.Role;
import com.hirehub.ats.model.User;
import com.hirehub.ats.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("recruiter@hirehub.com").isEmpty()) {
            User recruiter = User.builder()
                    .firstName("Jane")
                    .lastName("Recruiter")
                    .email("recruiter@hirehub.com")
                    .password(passwordEncoder.encode("recruiter123"))
                    .role(Role.RECRUITER)
                    .enabled(true)
                    .build();
            userRepository.save(recruiter);
            System.out.println("Default Recruiter initialized with email 'recruiter@hirehub.com' and password 'recruiter123'");
        }

        if (userRepository.findByEmail("candidate@hirehub.com").isEmpty()) {
            User candidate = User.builder()
                    .firstName("John")
                    .lastName("Candidate")
                    .email("candidate@hirehub.com")
                    .password(passwordEncoder.encode("candidate123"))
                    .role(Role.CANDIDATE)
                    .enabled(true)
                    .build();
            userRepository.save(candidate);
            System.out.println("Default Candidate initialized with email 'candidate@hirehub.com' and password 'candidate123'");
        }
    }
}
