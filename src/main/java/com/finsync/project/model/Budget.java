package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "budgets")
public class Budget {
    @Id
    private String id;

    private String category;
    private double budgeted;
    private double spent;
    private String color;

    @Indexed
    private String userId;

    public Budget() {}

    public Budget(String category, double budgeted, double spent, String color, String userId) {
        this.category = category;
        this.budgeted = budgeted;
        this.spent = spent;
        this.color = color;
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getBudgeted() { return budgeted; }
    public void setBudgeted(double budgeted) { this.budgeted = budgeted; }

    public double getSpent() { return spent; }
    public void setSpent(double spent) { this.spent = spent; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}