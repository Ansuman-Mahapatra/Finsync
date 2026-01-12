package com.finsync.project.controller;

import com.finsync.project.model.AppUser;
import com.finsync.project.service.UserService;
import com.finsync.project.payload.LoginRequest;
import com.finsync.project.payload.RegisterRequest;
import com.finsync.project.payload.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        // Simple registration without password encryption for now
        AppUser user = new AppUser(
            request.getName(),
            request.getEmail(),
            request.getPhone(),
            request.getPassword(), // Store plain password for now
            request.getUserType() != null ? request.getUserType() : "simple"
        );
        userService.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        // Simple login without JWT for now
        AppUser user = userService.findByPhone(request.getPhone());
        if (user != null && user.getPassword().equals(request.getPassword())) {
            JwtResponse response = new JwtResponse(
                "mock-token", 
                user.getId(), 
                user.getName(), 
                user.getEmail(), 
                user.getUserType()
            );
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().build();
    }
}
