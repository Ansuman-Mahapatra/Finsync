package com.finsync.project.controller;

import com.finsync.project.model.AppUser;
import com.finsync.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable String id) {
        Optional<AppUser> user = userService.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@PathVariable String id, @RequestBody AppUser userData) {
        Optional<AppUser> existingUser = userService.findById(id);
        if (existingUser.isPresent()) {
            AppUser user = existingUser.get();
            
            // Update only provided fields
            if (userData.getName() != null) {
                user.setName(userData.getName());
            }
            if (userData.getEmail() != null) {
                user.setEmail(userData.getEmail());
            }
            if (userData.getPhone() != null) {
                user.setPhone(userData.getPhone());
            }
            if (userData.getUserType() != null) {
                user.setUserType(userData.getUserType());
            }
            // Note: Password updates should be handled separately with proper encryption
            
            AppUser updatedUser = userService.save(user);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        Optional<AppUser> user = userService.findById(id);
        if (user.isPresent()) {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}