package com.finsync.project.controller;

import com.finsync.project.model.Bill;
import com.finsync.project.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public ResponseEntity<List<Bill>> getBills(@RequestParam String userId) {
        List<Bill> bills = billService.getAllBillsByUser(userId);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bill>> getBillsByStatus(@RequestParam String userId, @PathVariable String status) {
        List<Bill> bills = billService.getBillsByStatus(userId, status);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Bill>> getUpcomingBills(@RequestParam String userId) {
        List<Bill> bills = billService.getUpcomingBills(userId);
        return ResponseEntity.ok(bills);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Bill>> getOverdueBills(@RequestParam String userId) {
        List<Bill> bills = billService.getOverdueBills(userId);
        return ResponseEntity.ok(bills);
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        Bill savedBill = billService.saveBill(bill);
        return ResponseEntity.ok(savedBill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable String id, @RequestBody Bill bill) {
        bill.setId(id);
        Bill updatedBill = billService.saveBill(bill);
        return ResponseEntity.ok(updatedBill);
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Bill> markBillAsPaid(@PathVariable String id) {
        Bill paidBill = billService.markBillAsPaid(id);
        if (paidBill != null) {
            return ResponseEntity.ok(paidBill);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable String id) {
        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable String id) {
        Optional<Bill> bill = billService.getBillById(id);
        if (bill.isPresent()) {
            return ResponseEntity.ok(bill.get());
        }
        return ResponseEntity.notFound().build();
    }
}