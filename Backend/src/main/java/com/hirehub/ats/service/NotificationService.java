package com.hirehub.ats.service;

import com.hirehub.ats.model.Notification;
import com.hirehub.ats.model.User;
import com.hirehub.ats.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification sendNotification(User recipient, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long notificationId, User user) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (!n.getRecipient().getId().equals(user.getId())) {
                throw new IllegalArgumentException("You are not authorized to mark this notification as read");
            }
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
