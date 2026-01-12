package com.finsync.project.service;

import com.finsync.project.model.Bill;
import com.finsync.project.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public List<Bill> getAllBillsByUser(String userId) {
        return billRepository.findByUserIdOrderByDueDateAsc(userId);
    }

    public List<Bill> getBillsByStatus(String userId, String status) {
        return billRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Bill> getUpcomingBills(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate endOfMonth = today.plusMonths(1);
        return billRepository.findByUserIdAndDueDateBetween(userId, today, endOfMonth);
    }

    public List<Bill> getOverdueBills(String userId) {
        LocalDate today = LocalDate.now();
        return billRepository.findByUserIdAndDueDateLessThanAndStatus(userId, today, "upcoming");
    }

    public Bill saveBill(Bill bill) {
        // Update status based on due date
        LocalDate today = LocalDate.now();
        if (bill.getDueDate().isBefore(today) && !"paid".equals(bill.getStatus())) {
            bill.setStatus("overdue");
        } else if (bill.getDueDate().isAfter(today) && !"paid".equals(bill.getStatus())) {
            bill.setStatus("upcoming");
        }
        
        return billRepository.save(bill);
    }

    public Optional<Bill> getBillById(String id) {
        return billRepository.findById(id);
    }

    public void deleteBill(String id) {
        billRepository.deleteById(id);
    }

    public Bill markBillAsPaid(String id) {
        Optional<Bill> billOptional = billRepository.findById(id);
        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();
            bill.setStatus("paid");
            return billRepository.save(bill);
        }
        return null;
    }
}