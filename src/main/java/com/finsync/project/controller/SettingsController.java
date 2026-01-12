package com.finsync.project.controller;

import com.finsync.project.model.UserSettings;
import com.finsync.project.service.UserSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:3000")
public class SettingsController {

    @Autowired
    private UserSettingsService userSettingsService;

    @GetMapping
    public ResponseEntity<UserSettings> getUserSettings(@RequestParam String userId) {
        UserSettings settings = userSettingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<UserSettings> updateUserSettings(
            @RequestParam String userId, 
            @RequestBody UserSettings settings) {
        UserSettings updatedSettings = userSettingsService.updateUserSettings(userId, settings);
        return ResponseEntity.ok(updatedSettings);
    }

    @PostMapping("/reset")
    public ResponseEntity<UserSettings> resetToDefaults(@RequestParam String userId) {
        UserSettings defaultSettings = userSettingsService.resetToDefaults(userId);
        return ResponseEntity.ok(defaultSettings);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUserSettings(@RequestParam String userId) {
        userSettingsService.deleteUserSettings(userId);
        return ResponseEntity.noContent().build();
    }
}