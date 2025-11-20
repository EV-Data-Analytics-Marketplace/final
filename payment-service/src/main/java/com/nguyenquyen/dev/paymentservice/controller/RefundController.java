package com.nguyenquyen.dev.paymentservice.controller;

import com.nguyenquyen.dev.paymentservice.dto.request.RefundRequest;
import com.nguyenquyen.dev.paymentservice.dto.response.RefundResponse;
import com.nguyenquyen.dev.paymentservice.service.RefundService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {

    @Autowired
    private RefundService refundService;

    @PostMapping
    public ResponseEntity<?> createRefundRequest(@Valid @RequestBody RefundRequest request) {
        try {
            RefundResponse response = refundService.createRefundRequest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to create refund request", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-refunds")
    public ResponseEntity<?> getMyRefunds() {
        try {
            List<RefundResponse> refunds = refundService.getMyRefunds();
            return ResponseEntity.ok(refunds);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch refunds", "error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> approveRefund(@PathVariable Long id) {
        try {
            RefundResponse response = refundService.approveRefund(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to approve refund", "error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> rejectRefund(@PathVariable Long id, @RequestParam String reason) {
        try {
            RefundResponse response = refundService.rejectRefund(id, reason);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to reject refund", "error", e.getMessage()));
        }
    }
}
