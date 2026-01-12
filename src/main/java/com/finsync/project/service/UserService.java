package com.finsync.project.service;

import com.finsync.project.model.AppUser;
import com.finsync.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public AppUser save(AppUser appUser) {
        return userRepository.save(appUser);
    }
    
    public AppUser findByPhone(String phone) {
        return userRepository.findByPhone(phone).orElse(null);
    }
    
    public AppUser findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public java.util.Optional<AppUser> findById(String id) {
        return userRepository.findById(id);
    }
    
    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    public AppUser updateProfile(String userId, AppUser updatedUser) {
        AppUser appUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appUser.setName(updatedUser.getName());
        appUser.setEmail(updatedUser.getEmail());
        // Don't allow phone updates for security
        return userRepository.save(appUser);
    }
}
