package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userSettings")
public class UserSettings {
    @Id
    private String id;
    private String userId;
    private String currency;
    private String dateFormat;
    private String timeZone;
    private boolean notifications;
    private boolean emailAlerts;
    private boolean darkMode;
    private String language;
    private double monthlyBudgetLimit;
    private boolean twoFactorAuth;
    private String profilePicture;

    // Constructors
    public UserSettings() {}

    public UserSettings(String userId) {
        this.userId = userId;
        // Set default values
        this.currency = "USD";
        this.dateFormat = "MM/DD/YYYY";
        this.timeZone = "UTC";
        this.notifications = true;
        this.emailAlerts = true;
        this.darkMode = false;
        this.language = "en";
        this.monthlyBudgetLimit = 0.0;
        this.twoFactorAuth = false;
        this.profilePicture = null;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public boolean isNotifications() {
        return notifications;
    }

    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    public boolean isEmailAlerts() {
        return emailAlerts;
    }

    public void setEmailAlerts(boolean emailAlerts) {
        this.emailAlerts = emailAlerts;
    }

    public boolean isDarkMode() {
        return darkMode;
    }

    public void setDarkMode(boolean darkMode) {
        this.darkMode = darkMode;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public double getMonthlyBudgetLimit() {
        return monthlyBudgetLimit;
    }

    public void setMonthlyBudgetLimit(double monthlyBudgetLimit) {
        this.monthlyBudgetLimit = monthlyBudgetLimit;
    }

    public boolean isTwoFactorAuth() {
        return twoFactorAuth;
    }

    public void setTwoFactorAuth(boolean twoFactorAuth) {
        this.twoFactorAuth = twoFactorAuth;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}