package com.nguyenquyen.dev.analyticsservice.controller;

import com.nguyenquyen.dev.analyticsservice.dto.response.InsightResponse;
import com.nguyenquyen.dev.analyticsservice.repository.*;
import com.nguyenquyen.dev.analyticsservice.service.InsightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    @Autowired
    private InsightService insightService;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveInsights() {
        try {
            List<InsightResponse> insights = insightService.getActiveInsights();
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch insights", "error", e.getMessage()));
        }
    }

    @GetMapping("/dataset/{datasetId}")
    public ResponseEntity<?> getInsightsByDataset(@PathVariable Long datasetId) {
        try {
            List<InsightResponse> insights = insightService.getInsightsByDataset(datasetId);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch insights", "error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateInsight(@PathVariable Long id) {
        try {
            insightService.deactivateInsight(id);
            return ResponseEntity.ok(Map.of("message", "Insight deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to deactivate insight", "error", e.getMessage()));
        }
    }
}