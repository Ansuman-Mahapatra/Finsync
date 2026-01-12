package com.finsync.project.service;

import com.finsync.project.model.UserSettings;
import com.finsync.project.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSettingsService {
    
    @Autowired
    private UserSettingsRepository userSettingsRepository;

    public UserSettings getUserSettings(String userId) {
        Optional<UserSettings> settings = userSettingsRepository.findByUserId(userId);
        if (settings.isPresent()) {
            return settings.get();
        } else {
            // Create default settings for new users
            UserSettings defaultSettings = new UserSettings(userId);
            return userSettingsRepository.save(defaultSettings);
        }
    }

    public UserSettings updateUserSettings(String userId, UserSettings settings) {
        UserSettings existingSettings = getUserSettings(userId);
        
        // Update only non-null fields
        if (settings.getCurrency() != null) {
            existingSettings.setCurrency(settings.getCurrency());
        }
        if (settings.getDateFormat() != null) {
            existingSettings.setDateFormat(settings.getDateFormat());
        }
        if (settings.getTimeZone() != null) {
            existingSettings.setTimeZone(settings.getTimeZone());
        }
        if (settings.getLanguage() != null) {
            existingSettings.setLanguage(settings.getLanguage());
        }
        if (settings.getProfilePicture() != null) {
            existingSettings.setProfilePicture(settings.getProfilePicture());
        }
        
        // Update boolean values (they're never null)
        existingSettings.setNotifications(settings.isNotifications());
        existingSettings.setEmailAlerts(settings.isEmailAlerts());
        existingSettings.setDarkMode(settings.isDarkMode());
        existingSettings.setTwoFactorAuth(settings.isTwoFactorAuth());
        
        // Update double values
        if (settings.getMonthlyBudgetLimit() >= 0) {
            existingSettings.setMonthlyBudgetLimit(settings.getMonthlyBudgetLimit());
        }
        
        return userSettingsRepository.save(existingSettings);
    }

    public void deleteUserSettings(String userId) {
        userSettingsRepository.deleteByUserId(userId);
    }

    public UserSettings resetToDefaults(String userId) {
        deleteUserSettings(userId);
        return getUserSettings(userId); // This will create new default settings
    }
}