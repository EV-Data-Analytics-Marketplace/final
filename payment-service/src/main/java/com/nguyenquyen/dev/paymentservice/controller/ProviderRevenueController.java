package com.nguyenquyen.dev.paymentservice.controller;

import com.nguyenquyen.dev.paymentservice.dto.response.ProviderRevenueResponse;
import com.nguyenquyen.dev.paymentservice.service.ProviderRevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/revenue")
@PreAuthorize("hasAuthority('DATA_PROVIDER')")
public class ProviderRevenueController {

    @Autowired
    private ProviderRevenueService revenueService;

    @GetMapping("/my-revenue")
    public ResponseEntity<?> getMyRevenue() {
        try {
            List<ProviderRevenueResponse> revenues = revenueService.getMyRevenue();
            return ResponseEntity.ok(revenues);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch revenue", "error", e.getMessage()));
        }
    }

    @GetMapping("/month")
    public ResponseEntity<?> getRevenueByMonth(@RequestParam Integer year,
                                               @RequestParam Integer month) {
        try {
            ProviderRevenueResponse revenue = revenueService.getRevenueByMonth(year, month);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No revenue data found", "error", e.getMessage()));
        }
    }

    @GetMapping("/total-earnings")
    public ResponseEntity<?> getTotalEarnings() {
        try {
            BigDecimal total = revenueService.getTotalEarnings();
            return ResponseEntity.ok(Map.of(
                    "totalEarnings", total,
                    "currency", "USD"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch earnings", "error", e.getMessage()));
        }
    }
}