package com.nguyenquyen.dev.analyticsservice.controller;

import com.nguyenquyen.dev.analyticsservice.dto.request.CreateReportRequest;
import com.nguyenquyen.dev.analyticsservice.dto.response.AnalysisReportResponse;
import com.nguyenquyen.dev.analyticsservice.service.AnalysisReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class AnalysisReportController {

    @Autowired
    private AnalysisReportService reportService;

    @PostMapping
    public ResponseEntity<?> createReport(@Valid @RequestBody CreateReportRequest request) {
        try {
            AnalysisReportResponse response = reportService.createReport(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to create report", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-reports")
    public ResponseEntity<?> getMyReports() {
        try {
            List<AnalysisReportResponse> reports = reportService.getMyReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch reports", "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReportById(@PathVariable Long id) {
        try {
            AnalysisReportResponse report = reportService.getReportById(id);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Report not found", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to delete report", "error", e.getMessage()));
        }
    }
}