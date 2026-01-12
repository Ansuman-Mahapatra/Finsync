package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDate;

@Document(collection = "bills")
public class Bill {
    @Id
    private String id;

    private String name;
    private double amount;
    private LocalDate dueDate;
    private String category;
    private String status; // "upcoming", "overdue", "paid"
    private boolean recurring;
    private String recurringPeriod; // "monthly", "weekly", "yearly"

    @Indexed
    private String userId;

    public Bill() {}

    public Bill(String name, double amount, LocalDate dueDate, String category, String status, boolean recurring, String recurringPeriod, String userId) {
        this.name = name;
        this.amount = amount;
        this.dueDate = dueDate;
        this.category = category;
        this.status = status;
        this.recurring = recurring;
        this.recurringPeriod = recurringPeriod;
        this.userId = userId;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public double getAmount() { return amount; }
    public LocalDate getDueDate() { return dueDate; }
    public String getCategory() { return category; }
    public String getStatus() { return status; }
    public boolean isRecurring() { return recurring; }
    public String getRecurringPeriod() { return recurringPeriod; }
    public String getUserId() { return userId; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setCategory(String category) { this.category = category; }
    public void setStatus(String status) { this.status = status; }
    public void setRecurring(boolean recurring) { this.recurring = recurring; }
    public void setRecurringPeriod(String recurringPeriod) { this.recurringPeriod = recurringPeriod; }
    public void setUserId(String userId) { this.userId = userId; }
}