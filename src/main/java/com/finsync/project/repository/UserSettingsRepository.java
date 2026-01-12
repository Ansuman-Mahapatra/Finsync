package com.finsync.project.repository;

import com.finsync.project.model.UserSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends MongoRepository<UserSettings, String> {
    Optional<UserSettings> findByUserId(String userId);
    void deleteByUserId(String userId);
}