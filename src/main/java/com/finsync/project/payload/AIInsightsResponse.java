package com.finsync.project.payload;

import java.util.List;

public class AIInsightsResponse {
    private String mainSuggestion;
    private double potentialSavings;
    private List<CategoryInsight> categoryInsights;
    private List<SpendingPattern> spendingPatterns;

    public AIInsightsResponse() {}

    public AIInsightsResponse(String mainSuggestion, double potentialSavings, 
                              List<CategoryInsight> categoryInsights, List<SpendingPattern> spendingPatterns) {
        this.mainSuggestion = mainSuggestion;
        this.potentialSavings = potentialSavings;
        this.categoryInsights = categoryInsights;
        this.spendingPatterns = spendingPatterns;
    }

    // Getters and Setters
    public String getMainSuggestion() { return mainSuggestion; }
    public void setMainSuggestion(String mainSuggestion) { this.mainSuggestion = mainSuggestion; }
    public double getPotentialSavings() { return potentialSavings; }
    public void setPotentialSavings(double potentialSavings) { this.potentialSavings = potentialSavings; }
    public List<CategoryInsight> getCategoryInsights() { return categoryInsights; }
    public void setCategoryInsights(List<CategoryInsight> categoryInsights) { this.categoryInsights = categoryInsights; }
    public List<SpendingPattern> getSpendingPatterns() { return spendingPatterns; }
    public void setSpendingPatterns(List<SpendingPattern> spendingPatterns) { this.spendingPatterns = spendingPatterns; }

    public static class CategoryInsight {
        private String category;
        private double amount;
        private double percentage;
        private String trend;
        private String suggestion;

        public CategoryInsight() {}

        public CategoryInsight(String category, double amount, double percentage, String trend, String suggestion) {
            this.category = category;
            this.amount = amount;
            this.percentage = percentage;
            this.trend = trend;
            this.suggestion = suggestion;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
        public String getTrend() { return trend; }
        public void setTrend(String trend) { this.trend = trend; }
        public String getSuggestion() { return suggestion; }
        public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
    }

    public static class SpendingPattern {
        private String pattern;
        private String description;
        private String recommendation;

        public SpendingPattern() {}

        public SpendingPattern(String pattern, String description, String recommendation) {
            this.pattern = pattern;
            this.description = description;
            this.recommendation = recommendation;
        }

        public String getPattern() { return pattern; }
        public void setPattern(String pattern) { this.pattern = pattern; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    }
}
