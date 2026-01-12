package com.finsync.project.payload;

public class MerchantDashboardSummary {
    private double netSales;
    private double revenue;
    private int orders;
    private int customers;
    private double salesChange;
    private double revenueChange;
    private double ordersChange;
    private double customersChange;

    public MerchantDashboardSummary() {}

    public MerchantDashboardSummary(double netSales, double revenue, int orders, int customers,
                                     double salesChange, double revenueChange, double ordersChange, double customersChange) {
        this.netSales = netSales;
        this.revenue = revenue;
        this.orders = orders;
        this.customers = customers;
        this.salesChange = salesChange;
        this.revenueChange = revenueChange;
        this.ordersChange = ordersChange;
        this.customersChange = customersChange;
    }

    // Getters
    public double getNetSales() { return netSales; }
    public double getRevenue() { return revenue; }
    public int getOrders() { return orders; }
    public int getCustomers() { return customers; }
    public double getSalesChange() { return salesChange; }
    public double getRevenueChange() { return revenueChange; }
    public double getOrdersChange() { return ordersChange; }
    public double getCustomersChange() { return customersChange; }

    // Setters
    public void setNetSales(double netSales) { this.netSales = netSales; }
    public void setRevenue(double revenue) { this.revenue = revenue; }
    public void setOrders(int orders) { this.orders = orders; }
    public void setCustomers(int customers) { this.customers = customers; }
    public void setSalesChange(double salesChange) { this.salesChange = salesChange; }
    public void setRevenueChange(double revenueChange) { this.revenueChange = revenueChange; }
    public void setOrdersChange(double ordersChange) { this.ordersChange = ordersChange; }
    public void setCustomersChange(double customersChange) { this.customersChange = customersChange; }
}
