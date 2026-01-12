package com.finsync.project.controller;

import com.finsync.project.payload.BulkUploadResponse;
import com.finsync.project.payload.MerchantDashboardSummary;
import com.finsync.project.payload.RevenueBreakdownData;
import com.finsync.project.payload.SalesChartData;
import com.finsync.project.service.MerchantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/merchant")
@CrossOrigin(origins = "http://localhost:3000")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @GetMapping("/dashboard/summary")
    public ResponseEntity<MerchantDashboardSummary> getDashboardSummary(@RequestParam String userId) {
        return ResponseEntity.ok(merchantService.getDashboardSummary(userId));
    }

    @GetMapping("/dashboard/sales-chart")
    public ResponseEntity<SalesChartData> getSalesChartData(@RequestParam String userId) {
        return ResponseEntity.ok(merchantService.getSalesChartData(userId));
    }

    @GetMapping("/dashboard/revenue-breakdown")
    public ResponseEntity<RevenueBreakdownData> getRevenueBreakdown(@RequestParam String userId) {
        return ResponseEntity.ok(merchantService.getRevenueBreakdown(userId));
    }

    @PostMapping("/upload")
    public ResponseEntity<BulkUploadResponse> uploadTransactions(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId) {
        try {
            BulkUploadResponse response = merchantService.processBulkUpload(file, userId);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest()
                    .body(new BulkUploadResponse(false, 0, 0, 0, "Error processing file: " + e.getMessage()));
        }
    }
}
