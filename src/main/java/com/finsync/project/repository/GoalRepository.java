package com.finsync.project.repository;

import com.finsync.project.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserIdOrderByDeadlineAsc(String userId);
}