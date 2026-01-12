package com.finsync.project.service;

import com.finsync.project.model.Transaction;
import com.finsync.project.payload.BulkUploadResponse;
import com.finsync.project.payload.MerchantDashboardSummary;
import com.finsync.project.payload.RevenueBreakdownData;
import com.finsync.project.payload.SalesChartData;
import com.finsync.project.repository.TransactionRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MerchantService {

    @Autowired
    private TransactionRepository transactionRepository;

    public MerchantDashboardSummary getDashboardSummary(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusSeconds(1);

        // Current month data
        List<Transaction> currentMonthTransactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startOfMonth, now);
        List<Transaction> lastMonthTransactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startOfLastMonth, endOfLastMonth);

        // Calculate current month metrics
        double netSales = currentMonthTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double revenue = netSales; // For simplicity, treating sales as revenue

        int orders = (int) currentMonthTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .count();

        // Count unique customers (using description as customer identifier if available)
        int customers = (int) currentMonthTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .map(t -> t.getCategoryName() != null ? t.getCategoryName() : "Unknown")
                .distinct()
                .count();

        // Calculate last month metrics for comparison
        double lastMonthSales = lastMonthTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double lastMonthRevenue = lastMonthSales;

        int lastMonthOrders = (int) lastMonthTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .count();

        int lastMonthCustomers = (int) lastMonthTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .map(t -> t.getCategoryName() != null ? t.getCategoryName() : "Unknown")
                .distinct()
                .count();

        // Calculate percentage changes
        double salesChange = calculatePercentageChange(lastMonthSales, netSales);
        double revenueChange = calculatePercentageChange(lastMonthRevenue, revenue);
        double ordersChange = calculatePercentageChange(lastMonthOrders, orders);
        double customersChange = calculatePercentageChange(lastMonthCustomers, customers);

        return new MerchantDashboardSummary(netSales, revenue, orders, customers,
                salesChange, revenueChange, ordersChange, customersChange);
    }

    public SalesChartData getSalesChartData(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixMonthsAgo = now.minusMonths(6);

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, sixMonthsAgo, now);

        // Group by month
        Map<YearMonth, Double> monthlySales = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .collect(Collectors.groupingBy(
                        t -> YearMonth.from(t.getDate()),
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        // Create data points for last 6 months
        List<SalesChartData.ChartDataPoint> dataPoints = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.from(now.minusMonths(i));
            String monthName = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            double sales = monthlySales.getOrDefault(month, 0.0);
            dataPoints.add(new SalesChartData.ChartDataPoint(monthName, sales));
        }

        return new SalesChartData(dataPoints);
    }

    public RevenueBreakdownData getRevenueBreakdown(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        List<Transaction> currentMonthIncome = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startOfMonth, now)
                .stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .collect(Collectors.toList());

        // Group by category
        Map<String, Double> categoryRevenue = currentMonthIncome.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategoryName() != null && !t.getCategoryName().isEmpty() ? t.getCategoryName() : "Other",
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        double totalRevenue = categoryRevenue.values().stream().mapToDouble(Double::doubleValue).sum();

        // Define colors for different categories
        String[] colors = {"#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"};

        List<RevenueBreakdownData.RevenueDataPoint> dataPoints = new ArrayList<>();
        int colorIndex = 0;
        for (Map.Entry<String, Double> entry : categoryRevenue.entrySet()) {
            double percentage = totalRevenue > 0 ? (entry.getValue() / totalRevenue) * 100 : 0;
            dataPoints.add(new RevenueBreakdownData.RevenueDataPoint(
                    entry.getKey(),
                    Math.round(percentage * 100.0) / 100.0,
                    colors[colorIndex % colors.length]
            ));
            colorIndex++;
        }

        // Sort by value descending
        dataPoints.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        return new RevenueBreakdownData(dataPoints);
    }

    private double calculatePercentageChange(double oldValue, double newValue) {
        if (oldValue == 0) {
            return newValue > 0 ? 100.0 : 0.0;
        }
        return Math.round(((newValue - oldValue) / oldValue) * 100 * 100.0) / 100.0;
    }

    public BulkUploadResponse processBulkUpload(MultipartFile file, String userId) throws IOException {
        String fileName = file.getOriginalFilename();
        int processedCount = 0;
        int successCount = 0;
        int errorCount = 0;

        List<Transaction> transactions = new ArrayList<>();

        if (fileName != null && (fileName.endsWith(".xlsx") || fileName.endsWith(".xls"))) {
            // Process Excel file
            transactions = processExcelFile(file, userId);
        } else if (fileName != null && fileName.endsWith(".csv")) {
            // Process CSV file
            transactions = processCsvFile(file, userId);
        } else {
            return new BulkUploadResponse(false, 0, 0, 0, "Unsupported file format. Please upload Excel or CSV file.");
        }

        processedCount = transactions.size();

        // Save transactions
        for (Transaction transaction : transactions) {
            try {
                transactionRepository.save(transaction);
                successCount++;
            } catch (Exception e) {
                errorCount++;
            }
        }

        String message = String.format("Processed %d transactions: %d successful, %d failed", 
                                       processedCount, successCount, errorCount);
        return new BulkUploadResponse(true, processedCount, successCount, errorCount, message);
    }

    private List<Transaction> processExcelFile(MultipartFile file, String userId) throws IOException {
        List<Transaction> transactions = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            boolean isFirstRow = true;

            for (Row row : sheet) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue; // Skip header row
                }

                try {
                    Transaction transaction = parseExcelRow(row, userId);
                    if (transaction != null) {
                        transactions.add(transaction);
                    }
                } catch (Exception e) {
                    // Skip invalid rows
                    System.err.println("Error parsing row: " + e.getMessage());
                }
            }
        }

        return transactions;
    }

    private Transaction parseExcelRow(Row row, String userId) {
        try {
            // Expected format: Date, Description, Amount, Category
            Cell dateCell = row.getCell(0);
            Cell descCell = row.getCell(1);
            Cell amountCell = row.getCell(2);
            Cell categoryCell = row.getCell(3);

            if (dateCell == null || descCell == null || amountCell == null) {
                return null;
            }

            LocalDateTime date;
            if (dateCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dateCell)) {
                date = dateCell.getLocalDateTimeCellValue();
            } else {
                String dateStr = dateCell.getStringCellValue();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
                date = LocalDateTime.parse(dateStr + " 00:00:00", DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss"));
            }

            String description = descCell.getStringCellValue();
            double amount = amountCell.getNumericCellValue();
            String category = categoryCell != null ? categoryCell.getStringCellValue() : "Other";

            String type = amount >= 0 ? "INCOME" : "EXPENSE";
            amount = Math.abs(amount);

            Transaction transaction = new Transaction();
            transaction.setUserId(userId);
            transaction.setType(type);
            transaction.setAmount(amount);
            transaction.setDescription(description);
            transaction.setCategoryName(category);
            transaction.setDate(date);

            return transaction;
        } catch (Exception e) {
            System.err.println("Error parsing Excel row: " + e.getMessage());
            return null;
        }
    }

    private List<Transaction> processCsvFile(MultipartFile file, String userId) throws IOException {
        List<Transaction> transactions = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstRow = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue; // Skip header row
                }

                try {
                    Transaction transaction = parseCsvLine(line, userId);
                    if (transaction != null) {
                        transactions.add(transaction);
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing CSV line: " + e.getMessage());
                }
            }
        }

        return transactions;
    }

    private Transaction parseCsvLine(String line, String userId) {
        try {
            String[] parts = line.split(",");
            if (parts.length < 3) {
                return null;
            }

            String dateStr = parts[0].trim();
            String description = parts[1].trim();
            double amount = Double.parseDouble(parts[2].trim());
            String category = parts.length > 3 ? parts[3].trim() : "Other";

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            LocalDateTime date = LocalDateTime.parse(dateStr + " 00:00:00", DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss"));

            String type = amount >= 0 ? "INCOME" : "EXPENSE";
            amount = Math.abs(amount);

            Transaction transaction = new Transaction();
            transaction.setUserId(userId);
            transaction.setType(type);
            transaction.setAmount(amount);
            transaction.setDescription(description);
            transaction.setCategoryName(category);
            transaction.setDate(date);

            return transaction;
        } catch (Exception e) {
            System.err.println("Error parsing CSV line: " + e.getMessage());
            return null;
        }
    }
}
