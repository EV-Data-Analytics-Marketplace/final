package com.nguyenquyen.dev.paymentservice.service;

import com.nguyenquyen.dev.paymentservice.dto.request.RefundRequest;
import com.nguyenquyen.dev.paymentservice.dto.response.RefundResponse;
import com.nguyenquyen.dev.paymentservice.entity.Refund;
import com.nguyenquyen.dev.paymentservice.entity.Transaction;
import com.nguyenquyen.dev.paymentservice.repository.RefundRepository;
import com.nguyenquyen.dev.paymentservice.repository.TransactionRepository;
import com.nguyenquyen.dev.paymentservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class RefundService {

    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public RefundResponse createRefundRequest(RefundRequest request) {
        Transaction transaction = transactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!"COMPLETED".equals(transaction.getStatus())) {
            throw new RuntimeException("Can only refund completed transactions");
        }

        Long userId = UserContextHolder.getCurrentUserId();
        String userName = UserContextHolder.getCurrentUserFullName();

        if (!transaction.getConsumerId().equals(userId) &&
                !transaction.getProviderId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        if (request.getAmount().compareTo(transaction.getAmount()) > 0) {
            throw new RuntimeException("Refund amount cannot exceed transaction amount");
        }

        String refundId = "EVR_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();

        Refund refund = Refund.builder()
                .refundId(refundId)
                .transaction(transaction)
                .amount(request.getAmount())
                .currency(transaction.getCurrency())
                .reason(request.getReason())
                .description(request.getDescription())
                .status("PENDING")
                .requestedBy(userId)
                .requestedByName(userName)
                .build();

        refund = refundRepository.save(refund);

        return mapToResponse(refund);
    }

    public List<RefundResponse> getMyRefunds() {
        Long userId = UserContextHolder.getCurrentUserId();

        return refundRepository.findByRequestedBy(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RefundResponse approveRefund(Long id) {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refund not found"));

        if (!"PENDING".equals(refund.getStatus())) {
            throw new RuntimeException("Refund is not in pending status");
        }

        Long adminId = UserContextHolder.getCurrentUserId();
        String adminName = UserContextHolder.getCurrentUserFullName();

        refund.setStatus("APPROVED");
        refund.setApprovedBy(adminId);
        refund.setApprovedByName(adminName);
        refund.setApprovedAt(LocalDateTime.now());

        // Process refund
        boolean refundSuccess = processRefund(refund);

        if (refundSuccess) {
            refund.setStatus("COMPLETED");
            refund.setCompletedAt(LocalDateTime.now());
            refund.setPaymentGatewayRefundId("re_" + UUID.randomUUID().toString().substring(0, 24));

            // Update transaction
            Transaction transaction = refund.getTransaction();
            transaction.setStatus("REFUNDED");
            transactionRepository.save(transaction);
        }

        refund = refundRepository.save(refund);

        return mapToResponse(refund);
    }

    public RefundResponse rejectRefund(Long id, String reason) {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Refund not found"));

        if (!"PENDING".equals(refund.getStatus())) {
            throw new RuntimeException("Refund is not in pending status");
        }

        Long adminId = UserContextHolder.getCurrentUserId();
        String adminName = UserContextHolder.getCurrentUserFullName();

        refund.setStatus("REJECTED");
        refund.setApprovedBy(adminId);
        refund.setApprovedByName(adminName);
        refund.setApprovedAt(LocalDateTime.now());
        refund.setDescription(refund.getDescription() + " | Rejection reason: " + reason);

        refund = refundRepository.save(refund);

        return mapToResponse(refund);
    }

    private boolean processRefund(Refund refund) {
        // Mock refund processing
        try {
            Thread.sleep(500);
            return true;
        } catch (InterruptedException e) {
            return false;
        }
    }

    private RefundResponse mapToResponse(Refund refund) {
        return RefundResponse.builder()
                .id(refund.getId())
                .refundId(refund.getRefundId())
                .transactionId(refund.getTransaction().getId())
                .transactionRef(refund.getTransaction().getTransactionId())
                .amount(refund.getAmount())
                .currency(refund.getCurrency())
                .reason(refund.getReason())
                .description(refund.getDescription())
                .status(refund.getStatus())
                .requestedBy(refund.getRequestedBy())
                .requestedByName(refund.getRequestedByName())
                .approvedBy(refund.getApprovedBy())
                .approvedByName(refund.getApprovedByName())
                .approvedAt(refund.getApprovedAt())
                .createdAt(refund.getCreatedAt())
                .completedAt(refund.getCompletedAt())
                .build();
    }
}