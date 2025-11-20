package com.nguyenquyen.dev.paymentservice.controller;

import com.nguyenquyen.dev.paymentservice.dto.request.PaymentMethodRequest;
import com.nguyenquyen.dev.paymentservice.dto.response.PaymentMethodResponse;
import com.nguyenquyen.dev.paymentservice.service.PaymentMethodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @PostMapping
    public ResponseEntity<?> addPaymentMethod(@Valid @RequestBody PaymentMethodRequest request) {
        try {
            PaymentMethodResponse response = paymentMethodService.addPaymentMethod(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to add payment method", "error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyPaymentMethods() {
        try {
            List<PaymentMethodResponse> methods = paymentMethodService.getMyPaymentMethods();
            return ResponseEntity.ok(methods);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch payment methods", "error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/set-default")
    public ResponseEntity<?> setDefaultPaymentMethod(@PathVariable Long id) {
        try {
            PaymentMethodResponse response = paymentMethodService.setDefaultPaymentMethod(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to update payment method", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentMethod(@PathVariable Long id) {
        try {
            paymentMethodService.deletePaymentMethod(id);
            return ResponseEntity.ok(Map.of("message", "Payment method deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to delete payment method", "error", e.getMessage()));
        }
    }
}