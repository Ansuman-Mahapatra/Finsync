package com.finsync.project.service;

import com.finsync.project.model.Goal;
import com.finsync.project.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getGoalsByUser(String userId) {
        return goalRepository.findByUserIdOrderByDeadlineAsc(userId);
    }

    public Optional<Goal> getGoalById(String id) {
        return goalRepository.findById(id);
    }

    public Goal saveGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public void deleteGoal(String id) {
        goalRepository.deleteById(id);
    }
}