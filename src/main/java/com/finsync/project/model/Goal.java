package com.finsync.project.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "goals")
public class Goal {
    @Id
    private String id;

    private String name;
    private double target;
    private double current;
    private LocalDate deadline;
    private String category;
    private String color;

    @Indexed
    private String userId;

    public Goal() {}

    public Goal(String name, double target, double current, LocalDate deadline, String category, String color, String userId) {
        this.name = name;
        this.target = target;
        this.current = current;
        this.deadline = deadline;
        this.category = category;
        this.color = color;
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getTarget() { return target; }
    public void setTarget(double target) { this.target = target; }

    public double getCurrent() { return current; }
    public void setCurrent(double current) { this.current = current; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}