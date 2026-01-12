package com.finsync.project.repository;

import com.finsync.project.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String> {
    List<Budget> findByUserIdOrderByCategoryAsc(String userId);
}