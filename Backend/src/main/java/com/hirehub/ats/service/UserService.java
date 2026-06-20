package com.hirehub.ats.service;

import com.hirehub.ats.model.Role;
import com.hirehub.ats.model.User;
import com.hirehub.ats.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() != Role.CANDIDATE && user.getRole() != Role.RECRUITER) {
            throw new IllegalArgumentException("Invalid user role");
        }
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public User registerCandidate(User user) {
        user.setRole(Role.CANDIDATE);
        return registerUser(user);
    }

    public User registerRecruiter(User user) {
        user.setRole(Role.RECRUITER);
        return registerUser(user);
    }
}
