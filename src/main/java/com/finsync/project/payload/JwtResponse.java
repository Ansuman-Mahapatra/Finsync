package com.finsync.project.payload;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String userId;
    private String name;
    private String email;
    private String userType;

    public JwtResponse(String token) {
        this.token = token;
    }
    
    public JwtResponse(String token, String userId, String name, String email, String userType) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.userType = userType;
    }

    // Getters
    public String getToken() { return token; }
    public String getType() { return type; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getUserType() { return userType; }
    
    // Setters
    public void setToken(String token) { this.token = token; }
    public void setType(String type) { this.type = type; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setUserType(String userType) { this.userType = userType; }
}
