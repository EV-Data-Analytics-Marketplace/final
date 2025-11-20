package com.nguyenquyen.dev.paymentservice.controller;


import com.nguyenquyen.dev.paymentservice.dto.response.PaymentStatsResponse;
import com.nguyenquyen.dev.paymentservice.entity.ProviderRevenue;
import com.nguyenquyen.dev.paymentservice.entity.Refund;
import com.nguyenquyen.dev.paymentservice.entity.Transaction;
import com.nguyenquyen.dev.paymentservice.repository.ProviderRevenueRepository;
import com.nguyenquyen.dev.paymentservice.repository.RefundRepository;
import com.nguyenquyen.dev.paymentservice.repository.TransactionRepository;
import com.nguyenquyen.dev.paymentservice.service.ProviderRevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/payment")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminPaymentController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private ProviderRevenueRepository providerRevenueRepository;

    @Autowired
    private ProviderRevenueService providerRevenueService;

    @GetMapping("/stats")
    public ResponseEntity<?> getPaymentStats() {
        try {
            Long totalTransactions = transactionRepository.count();
            Long completedTransactions = transactionRepository.countCompletedTransactions();

            List<Transaction> allTransactions = transactionRepository.findAll();
            Long pendingTransactions = allTransactions.stream()
                    .filter(t -> "PENDING".equals(t.getStatus()))
                    .count();
            Long failedTransactions = allTransactions.stream()
                    .filter(t -> "FAILED".equals(t.getStatus()))
                    .count();

            BigDecimal totalRevenue = transactionRepository.sumTotalRevenue();
            BigDecimal platformFees = transactionRepository.sumPlatformFees();

            List<Refund> refunds = refundRepository.findAll();
            Long totalRefunds = (long) refunds.size();
            BigDecimal totalRefundAmount = refunds.stream()
                    .filter(r -> "COMPLETED".equals(r.getStatus()))
                    .map(Refund::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Long> transactionsByType = allTransactions.stream()
                    .filter(t -> "COMPLETED".equals(t.getStatus()))
                    .collect(Collectors.groupingBy(Transaction::getTransactionType, Collectors.counting()));

            PaymentStatsResponse stats = PaymentStatsResponse.builder()
                    .totalTransactions(totalTransactions)
                    .completedTransactions(completedTransactions)
                    .pendingTransactions(pendingTransactions)
                    .failedTransactions(failedTransactions)
                    .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                    .platformFees(platformFees != null ? platformFees : BigDecimal.ZERO)
                    .providerRevenues((totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                            .subtract(platformFees != null ? platformFees : BigDecimal.ZERO))
                    .totalRefunds(totalRefunds)
                    .totalRefundAmount(totalRefundAmount)
                    .transactionsByType(transactionsByType)
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch stats", "error", e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions(@RequestParam(required = false) String status) {
        try {
            List<Transaction> transactions;

            if (status != null && !status.isEmpty()) {
                transactions = transactionRepository.findByStatus(status);
            } else {
                transactions = transactionRepository.findAll();
            }

            return ResponseEntity.ok(Map.of(
                    "total", transactions.size(),
                    "transactions", transactions
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch transactions", "error", e.getMessage()));
        }
    }

    @GetMapping("/refunds")
    public ResponseEntity<?> getAllRefunds(@RequestParam(required = false) String status) {
        try {
            List<Refund> refunds;

            if (status != null && !status.isEmpty()) {
                refunds = refundRepository.findByStatus(status);
            } else {
                refunds = refundRepository.findAll();
            }

            return ResponseEntity.ok(Map.of(
                    "total", refunds.size(),
                    "refunds", refunds
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch refunds", "error", e.getMessage()));
        }
    }

    @GetMapping("/provider-revenues")
    public ResponseEntity<?> getAllProviderRevenues() {
        try {
            List<ProviderRevenue> revenues = providerRevenueRepository.findAll();
            return ResponseEntity.ok(Map.of(
                    "total", revenues.size(),
                    "revenues", revenues
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch provider revenues", "error", e.getMessage()));
        }
    }

    @PostMapping("/calculate-monthly-revenue")
    public ResponseEntity<?> calculateMonthlyRevenue(@RequestParam Integer year,
                                                     @RequestParam Integer month) {
        try {
            providerRevenueService.calculateMonthlyRevenue(year, month);
            return ResponseEntity.ok(Map.of("message", "Monthly revenue calculated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to calculate revenue", "error", e.getMessage()));
        }
    }
}