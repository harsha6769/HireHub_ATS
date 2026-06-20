package com.hirehub.ats.controller;

import com.hirehub.ats.model.Notification;
import com.hirehub.ats.model.User;
import com.hirehub.ats.security.CustomUserDetails;
import com.hirehub.ats.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    private User getAuthenticatedUser() {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            User user = getAuthenticatedUser();
            notificationService.markAsRead(id, user);
            return ResponseEntity.ok("Notification marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
