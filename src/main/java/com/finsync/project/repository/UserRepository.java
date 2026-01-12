package com.finsync.project.repository;

import com.finsync.project.model.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);
    Optional<AppUser> findByPhone(String phone);
}
