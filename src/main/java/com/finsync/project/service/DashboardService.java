package com.finsync.project.service;

import com.finsync.project.payload.AIInsightsResponse;
import com.finsync.project.payload.DashboardSummary;
import com.finsync.project.payload.SuggestionResponse;

public interface DashboardService {
    DashboardSummary getSummary(String userId);
    SuggestionResponse getSuggestions(String userId);
    AIInsightsResponse getEnhancedInsights(String userId);
}
