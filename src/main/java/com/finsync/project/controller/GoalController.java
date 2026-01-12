package com.finsync.project.controller;

import com.finsync.project.model.Goal;
import com.finsync.project.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping
    public ResponseEntity<List<Goal>> getGoals(@RequestParam String userId) {
        return ResponseEntity.ok(goalService.getGoalsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        Goal saved = goalService.saveGoal(goal);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable String id, @RequestBody Goal goal) {
        goal.setId(id);
        Goal saved = goalService.saveGoal(goal);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable String id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoal(@PathVariable String id) {
        Optional<Goal> goal = goalService.getGoalById(id);
        return goal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}