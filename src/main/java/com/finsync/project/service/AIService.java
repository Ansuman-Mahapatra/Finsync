package com.finsync.project.service;

import com.finsync.project.model.Transaction;
import com.finsync.project.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    public String getAIInsights(String userId) {
        try {
            List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
            
            if (transactions.isEmpty()) {
                return "You don't have any transactions yet. Start adding transactions to get personalized AI insights!";
            }

            // Prepare financial data summary
            double totalIncome = transactions.stream()
                    .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                    .mapToDouble(Transaction::getAmount).sum();
            
            double totalExpense = transactions.stream()
                    .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                    .mapToDouble(Transaction::getAmount).sum();

            Map<String, Double> categorySpending = transactions.stream()
                    .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                    .collect(Collectors.groupingBy(
                            t -> t.getCategoryName() != null ? t.getCategoryName() : "Other",
                            Collectors.summingDouble(Transaction::getAmount)
                    ));

            String financialContext = String.format(
                    "User has %d transactions. Total Income: $%.2f, Total Expenses: $%.2f, Net: $%.2f. " +
                    "Top spending categories: %s",
                    transactions.size(),
                    totalIncome,
                    totalExpense,
                    totalIncome - totalExpense,
                    categorySpending.entrySet().stream()
                            .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                            .limit(5)
                            .map(e -> String.format("%s ($%.2f)", e.getKey(), e.getValue()))
                            .collect(Collectors.joining(", "))
            );

            String prompt = "You are a financial advisor AI assistant. Analyze the following financial data and provide " +
                    "concise, actionable insights and recommendations (2-3 sentences max). Focus on spending patterns, " +
                    "potential savings opportunities, and financial health improvements.\n\n" +
                    "Financial Data: " + financialContext;

            return callOpenAI(prompt);
        } catch (Exception e) {
            e.printStackTrace();
            return "I'm having trouble analyzing your finances right now. Please try again later.";
        }
    }

    public String getAIChatResponse(String userId, String userMessage) {
        try {
            List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userId);
            
            // Build context from user's financial data
            StringBuilder context = new StringBuilder();
            if (!transactions.isEmpty()) {
                double totalIncome = transactions.stream()
                        .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                        .mapToDouble(Transaction::getAmount).sum();
                
                double totalExpense = transactions.stream()
                        .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                        .mapToDouble(Transaction::getAmount).sum();

                context.append(String.format(
                        "User's financial context: %d transactions, Income: $%.2f, Expenses: $%.2f, Net: $%.2f. ",
                        transactions.size(), totalIncome, totalExpense, totalIncome - totalExpense
                ));
            }

            String prompt = "You are a helpful financial assistant for FinSync. " +
                    context.toString() +
                    "Answer the user's question about their finances in a friendly, concise way (2-4 sentences). " +
                    "If the question is about specific data you don't have access to, politely say so.\n\n" +
                    "User question: " + userMessage;

            return callOpenAI(prompt);
        } catch (Exception e) {
            e.printStackTrace();
            return "I'm having trouble processing your request. Please try again or ask about your transactions, budgets, or bills.";
        }
    }

    private String callOpenAI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + openaiApiKey);
            headers.set("Content-Type", "application/json");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            
            requestBody.put("messages", List.of(message));
            requestBody.put("max_tokens", 200);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> messageObj = (Map<String, Object>) choice.get("message");
                    return (String) messageObj.get("content");
                }
            }
            
            return "Unable to generate AI response. Please try again.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error connecting to AI service. Please try again later.";
        }
    }
}


