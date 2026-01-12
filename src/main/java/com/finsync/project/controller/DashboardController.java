package com.finsync.project.controller;

import com.finsync.project.service.DashboardService;
import com.finsync.project.payload.AIInsightsResponse;
import com.finsync.project.payload.DashboardSummary;
import com.finsync.project.payload.SuggestionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary(@RequestParam String userId) {
        return ResponseEntity.ok(dashboardService.getSummary(userId));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<SuggestionResponse> getSuggestions(@RequestParam String userId) {
        return ResponseEntity.ok(dashboardService.getSuggestions(userId));
    }

    @GetMapping("/enhanced-insights")
    public ResponseEntity<AIInsightsResponse> getEnhancedInsights(@RequestParam String userId) {
        return ResponseEntity.ok(dashboardService.getEnhancedInsights(userId));
    }
}
