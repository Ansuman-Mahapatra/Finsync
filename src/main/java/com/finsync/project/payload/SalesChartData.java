package com.finsync.project.payload;

import java.util.List;

public class SalesChartData {
    private List<ChartDataPoint> data;

    public SalesChartData() {}

    public SalesChartData(List<ChartDataPoint> data) {
        this.data = data;
    }

    public List<ChartDataPoint> getData() { return data; }
    public void setData(List<ChartDataPoint> data) { this.data = data; }

    public static class ChartDataPoint {
        private String name;
        private double sales;

        public ChartDataPoint() {}

        public ChartDataPoint(String name, double sales) {
            this.name = name;
            this.sales = sales;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double getSales() { return sales; }
        public void setSales(double sales) { this.sales = sales; }
    }
}
