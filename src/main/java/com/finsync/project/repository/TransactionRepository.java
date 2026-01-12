package com.finsync.project.repository;

import com.finsync.project.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    List<Transaction> findByUserIdOrderByDateDesc(String userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDateTime start, LocalDateTime end);
    
    List<Transaction> findByUserIdAndType(String userId, String type);
    
    List<Transaction> findTop5ByUserIdOrderByDateDesc(String userId);
}
