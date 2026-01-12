package com.finsync.project.payload;

import java.util.List;

public class RevenueBreakdownData {
    private List<RevenueDataPoint> data;

    public RevenueBreakdownData() {}

    public RevenueBreakdownData(List<RevenueDataPoint> data) {
        this.data = data;
    }

    public List<RevenueDataPoint> getData() { return data; }
    public void setData(List<RevenueDataPoint> data) { this.data = data; }

    public static class RevenueDataPoint {
        private String name;
        private double value;
        private String color;

        public RevenueDataPoint() {}

        public RevenueDataPoint(String name, double value, String color) {
            this.name = name;
            this.value = value;
            this.color = color;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
