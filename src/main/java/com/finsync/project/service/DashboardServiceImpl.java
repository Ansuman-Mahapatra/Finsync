package com.finsync.project.service;

import com.finsync.project.model.Transaction;
import com.finsync.project.repository.TransactionRepository;
import com.finsync.project.payload.AIInsightsResponse;
import com.finsync.project.payload.DashboardSummary;
import com.finsync.project.payload.SuggestionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public DashboardSummary getSummary(String userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);

        double totalIncome = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount).sum();

        double totalExpense = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount).sum();

        double totalBalance = totalIncome - totalExpense;
        double savings = Math.max(0, totalIncome - totalExpense);
        double balanceChange = 5.2; // Mock data for now, could be calculated from previous month
        double savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

        return new DashboardSummary(totalBalance, totalIncome, totalExpense, savings, balanceChange, savingsPercentage);
    }


    @Override
    public SuggestionResponse getSuggestions(String userId) {
        DashboardSummary summary = getSummary(userId);
        String suggestion;

        if (summary.getExpenses() > summary.getIncome()) {
            suggestion = "⚠️ Your expenses exceed your income! Consider reducing spending.";
        } else if (summary.getSavingsPercentage() < 10) {
            suggestion = "⚡ Try to save at least 10% of your income for better financial health.";
        } else {
            suggestion = "✅ Great job! You're managing your finances well.";
        }

        return new SuggestionResponse(suggestion);
    }

    @Override
    public AIInsightsResponse getEnhancedInsights(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);

        List<Transaction> currentMonthTransactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startOfMonth, now);
        List<Transaction> lastMonthTransactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startOfLastMonth, endOfLastMonth);

        // Calculate category insights
        List<Transaction> currentExpenses = currentMonthTransactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        Map<String, Double> categorySpending = currentExpenses.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategoryName() != null ? t.getCategoryName() : "Other",
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        double totalExpenses = categorySpending.values().stream().mapToDouble(Double::doubleValue).sum();

        List<AIInsightsResponse.CategoryInsight> categoryInsights = new ArrayList<>();
        for (Map.Entry<String, Double> entry : categorySpending.entrySet()) {
            double percentage = totalExpenses > 0 ? (entry.getValue() / totalExpenses) * 100 : 0;
            String trend = "stable";
            String suggestion = generateCategorySuggestion(entry.getKey(), percentage);

            categoryInsights.add(new AIInsightsResponse.CategoryInsight(
                    entry.getKey(),
                    entry.getValue(),
                    Math.round(percentage * 100.0) / 100.0,
                    trend,
                    suggestion
            ));
        }

        // Calculate spending patterns
        List<AIInsightsResponse.SpendingPattern> patterns = new ArrayList<>();
        
        if (categoryInsights.stream().anyMatch(ci -> "Food".equals(ci.getCategory()) && ci.getPercentage() > 30)) {
            patterns.add(new AIInsightsResponse.SpendingPattern(
                    "High Food Spending",
                    "Food expenses are higher than recommended (30%+ of total spending)",
                    "Consider meal planning and cooking at home to reduce food costs"
            ));
        }

        if (currentMonthTransactions.stream().filter(t -> "EXPENSE".equalsIgnoreCase(t.getType())).count() > 50) {
            patterns.add(new AIInsightsResponse.SpendingPattern(
                    "Frequent Small Transactions",
                    "You have many small transactions this month",
                    "Consider consolidating purchases to reduce impulse spending"
            ));
        }

        // Calculate potential savings
        double avgLastMonthExpenses = lastMonthTransactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double currentExpensesTotal = currentExpenses.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();

        double potentialSavings = Math.max(0, currentExpensesTotal * 0.15); // Suggest 15% reduction

        // Generate main suggestion
        String mainSuggestion = generateMainSuggestion(currentExpensesTotal, avgLastMonthExpenses, categoryInsights);

        return new AIInsightsResponse(mainSuggestion, potentialSavings, categoryInsights, patterns);
    }

    private String generateCategorySuggestion(String category, double percentage) {
        if (percentage > 30) {
            return "High spending in " + category + ". Consider setting a budget limit.";
        } else if (percentage > 20) {
            return "Moderate spending in " + category + ". Monitor to prevent overspending.";
        } else {
            return "Spending in " + category + " is within a healthy range.";
        }
    }

    private String generateMainSuggestion(double currentExpenses, double lastMonthExpenses, 
                                          List<AIInsightsResponse.CategoryInsight> insights) {
        if (currentExpenses > lastMonthExpenses * 1.2) {
            return "Your spending is up 20%+ this month. Review your budget and identify areas to cut back.";
        } else if (insights.stream().anyMatch(i -> i.getPercentage() > 35)) {
            return "One category is taking up more than 35% of your budget. Diversify your spending for better financial health.";
        } else if (currentExpenses < lastMonthExpenses * 0.8) {
            return "Great job! You've reduced spending by 20%+ compared to last month. Keep it up!";
        } else {
            return "Your spending is consistent. Consider automating savings to build your emergency fund.";
        }
    }
}
