package com.finsync.project.repository;

import com.finsync.project.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {
    List<Bill> findByUserIdOrderByDueDateAsc(String userId);
    List<Bill> findByUserIdAndStatus(String userId, String status);
    List<Bill> findByUserIdAndDueDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    List<Bill> findByUserIdAndDueDateLessThanAndStatus(String userId, LocalDate date, String status);
}