package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "users")
public class AppUser {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String phone;

    private String password; // stored as hashed (BCrypt)
    
    private String userType; // "simple" or "merchant"

    // MongoDB doesn't need explicit relationships - we'll use references
    private List<String> accountIds = new ArrayList<>();
    private List<String> goalIds = new ArrayList<>();

    public AppUser() {}

    public AppUser(String name, String email, String phone, String password, String userType) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.userType = userType;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }
    public String getUserType() { return userType; }
    public List<String> getAccountIds() { return accountIds; }
    public List<String> getGoalIds() { return goalIds; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPassword(String password) { this.password = password; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setAccountIds(List<String> accountIds) { this.accountIds = accountIds; }
    public void setGoalIds(List<String> goalIds) { this.goalIds = goalIds; }
}
