package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;

    private String type; // INCOME or EXPENSE
    private double amount;
    private LocalDateTime date;
    private String description;

    // References to other documents
    @Indexed
    private String userId;
    
    private String categoryId;
    private String categoryName;
    
    private String accountId; // Bank account reference

    public Transaction() {}

    public Transaction(String type, double amount, LocalDateTime date, String description, String userId, String categoryId, String categoryName, String accountId) {
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.description = description;
        this.userId = userId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.accountId = accountId;
    }

    // Getters
    public String getId() { return id; }
    public String getType() { return type; }
    public double getAmount() { return amount; }
    public LocalDateTime getDate() { return date; }
    public String getDescription() { return description; }
    public String getUserId() { return userId; }
    public String getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public String getAccountId() { return accountId; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setDescription(String description) { this.description = description; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setAccountId(String accountId) { this.accountId = accountId; }
}
