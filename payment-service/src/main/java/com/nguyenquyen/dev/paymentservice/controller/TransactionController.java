package com.nguyenquyen.dev.paymentservice.controller;

import com.nguyenquyen.dev.paymentservice.dto.request.CreateTransactionRequest;
import com.nguyenquyen.dev.paymentservice.dto.response.TransactionResponse;
import com.nguyenquyen.dev.paymentservice.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        try {
            TransactionResponse response = transactionService.createTransaction(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Transaction failed", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-transactions")
    public ResponseEntity<?> getMyTransactions() {
        try {
            List<TransactionResponse> transactions = transactionService.getMyTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch transactions", "error", e.getMessage()));
        }
    }

    @GetMapping("/consumer")
    @PreAuthorize("hasAuthority('DATA_CONSUMER')")
    public ResponseEntity<?> getConsumerTransactions() {
        try {
            List<TransactionResponse> transactions = transactionService.getConsumerTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch transactions", "error", e.getMessage()));
        }
    }

    @GetMapping("/provider")
    @PreAuthorize("hasAuthority('DATA_PROVIDER')")
    public ResponseEntity<?> getProviderTransactions() {
        try {
            List<TransactionResponse> transactions = transactionService.getProviderTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch transactions", "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        try {
            TransactionResponse transaction = transactionService.getTransactionById(id);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Transaction not found", "error", e.getMessage()));
        }
    }

    @GetMapping("/ref/{transactionId}")
    public ResponseEntity<?> getTransactionByRef(@PathVariable String transactionId) {
        try {
            TransactionResponse transaction = transactionService.getTransactionByTransactionId(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Transaction not found", "error", e.getMessage()));
        }
    }
}
