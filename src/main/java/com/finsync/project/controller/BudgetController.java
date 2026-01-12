package com.finsync.project.controller;

import com.finsync.project.model.Budget;
import com.finsync.project.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(@RequestParam String userId) {
        return ResponseEntity.ok(budgetService.getBudgetsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.saveBudget(budget));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> updateBudget(@PathVariable String id, @RequestBody Budget budget) {
        budget.setId(id);
        return ResponseEntity.ok(budgetService.saveBudget(budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable String id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudget(@PathVariable String id) {
        Optional<Budget> budget = budgetService.getBudgetById(id);
        return budget.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}