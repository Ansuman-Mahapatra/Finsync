package com.finsync.project.payload;

public class DashboardSummary {
    private double totalBalance;
    private double income;
    private double expenses;
    private double savings;
    private double balanceChange;
    private double savingsPercentage;

    public DashboardSummary() {}

    public DashboardSummary(double totalBalance, double income, double expenses, double savings, double balanceChange, double savingsPercentage) {
        this.totalBalance = totalBalance;
        this.income = income;
        this.expenses = expenses;
        this.savings = savings;
        this.balanceChange = balanceChange;
        this.savingsPercentage = savingsPercentage;
    }

    // Getters
    public double getTotalBalance() { return totalBalance; }
    public double getIncome() { return income; }
    public double getExpenses() { return expenses; }
    public double getSavings() { return savings; }
    public double getBalanceChange() { return balanceChange; }
    public double getSavingsPercentage() { return savingsPercentage; }

    // Setters
    public void setTotalBalance(double totalBalance) { this.totalBalance = totalBalance; }
    public void setIncome(double income) { this.income = income; }
    public void setExpenses(double expenses) { this.expenses = expenses; }
    public void setSavings(double savings) { this.savings = savings; }
    public void setBalanceChange(double balanceChange) { this.balanceChange = balanceChange; }
    public void setSavingsPercentage(double savingsPercentage) { this.savingsPercentage = savingsPercentage; }
}
