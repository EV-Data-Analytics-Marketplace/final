package com.nguyenquyen.dev.analyticsservice.controller;

import com.nguyenquyen.dev.analyticsservice.dto.request.CreateDashboardRequest;
import com.nguyenquyen.dev.analyticsservice.dto.response.DashboardResponse;
import com.nguyenquyen.dev.analyticsservice.repository.*;
import com.nguyenquyen.dev.analyticsservice.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @PostMapping
    public ResponseEntity<?> createDashboard(@Valid @RequestBody CreateDashboardRequest request) {
        try {
            DashboardResponse response = dashboardService.createDashboard(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to create dashboard", "error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDashboard(@PathVariable Long id,
                                             @Valid @RequestBody CreateDashboardRequest request) {
        try {
            DashboardResponse response = dashboardService.updateDashboard(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to update dashboard", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-dashboards")
    public ResponseEntity<?> getMyDashboards() {
        try {
            List<DashboardResponse> dashboards = dashboardService.getMyDashboards();
            return ResponseEntity.ok(dashboards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch dashboards", "error", e.getMessage()));
        }
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicDashboards() {
        try {
            List<DashboardResponse> dashboards = dashboardService.getPublicDashboards();
            return ResponseEntity.ok(dashboards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch dashboards", "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDashboardById(@PathVariable Long id) {
        try {
            DashboardResponse dashboard = dashboardService.getDashboardById(id);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Dashboard not found", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDashboard(@PathVariable Long id) {
        try {
            dashboardService.deleteDashboard(id);
            return ResponseEntity.ok(Map.of("message", "Dashboard deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to delete dashboard", "error", e.getMessage()));
        }
    }
}