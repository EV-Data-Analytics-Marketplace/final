package com.nguyenquyen.dev.paymentservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "service", "Payment Service",
                "timestamp", LocalDateTime.now(),
                "message", "Payment Service is running"
        ));
    }

    @GetMapping("/info")
    public ResponseEntity<?> info() {
        return ResponseEntity.ok(Map.of(
                "service", "Payment Service",
                "version", "1.0.0",
                "description", "Payment and Transaction Service for EV Data Analytics Marketplace",
                "endpoints", Map.of(
                        "transactions", "/api/transactions",
                        "paymentMethods", "/api/payment-methods",
                        "refunds", "/api/refunds",
                        "revenue", "/api/revenue",
                        "admin", "/api/admin/payment"
                )
        ));
    }
}

