package com.finsync.project.service;

import com.finsync.project.model.Transaction;
import com.finsync.project.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUserId(String userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Transaction> getRecentTransactions(String userId) {
        return transactionRepository.findTop5ByUserIdOrderByDateDesc(userId);
    }

    public Transaction saveTransaction(Transaction transaction) {
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDateTime.now());
        }
        return transactionRepository.save(transaction);
    }

    public Optional<Transaction> getTransactionById(String id) {
        return transactionRepository.findById(id);
    }

    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }

    public List<Transaction> getTransactionsByType(String userId, String type) {
        return transactionRepository.findByUserIdAndType(userId, type);
    }

    public List<Transaction> getTransactionsByDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
    }
}
