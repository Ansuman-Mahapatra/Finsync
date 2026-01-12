package com.finsync.project.service;

import com.finsync.project.model.Budget;
import com.finsync.project.model.Transaction;
import com.finsync.project.repository.BudgetRepository;
import com.finsync.project.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Budget> getBudgetsByUser(String userId) {
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCategoryAsc(userId);
        
        // Calculate spent amount for each budget from transactions
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        
        for (Budget budget : budgets) {
            double spent = calculateSpentForCategory(userId, budget.getCategory(), startOfMonth, now);
            budget.setSpent(spent);
        }
        
        return budgets;
    }

    private double calculateSpentForCategory(String userId, String category, LocalDateTime start, LocalDateTime end) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);
        
        return transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .filter(t -> category.equalsIgnoreCase(t.getCategoryName()))
                .mapToDouble(Transaction::getAmount)
                .sum();
    }

    public Optional<Budget> getBudgetById(String id) {
        return budgetRepository.findById(id);
    }

    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }
}
