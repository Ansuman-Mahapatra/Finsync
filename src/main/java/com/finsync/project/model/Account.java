package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "accounts")
public class Account {
    @Id
    private String id;

    private String name;
    private String type; // Checking, Credit, Investment, etc.
    private double balance;
    private String color;

    @Indexed
    private String userId;

    public Account() {}

    public Account(String name, String type, double balance, String color, String userId) {
        this.name = name;
        this.type = type;
        this.balance = balance;
        this.color = color;
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}