package com.finsync.project.controller;

import com.finsync.project.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    @Autowired
    private AIService aiService;

    @GetMapping("/insights")
    public ResponseEntity<Map<String, String>> getAIInsights(@RequestParam String userId) {
        String insights = aiService.getAIInsights(userId);
        Map<String, String> response = new HashMap<>();
        response.put("insights", insights);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestParam String userId, @RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Message is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        String response = aiService.getAIChatResponse(userId, message);
        Map<String, String> result = new HashMap<>();
        result.put("response", response);
        return ResponseEntity.ok(result);
    }
}


