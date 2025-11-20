package com.nguyenquyen.dev.paymentservice.service;


import com.nguyenquyen.dev.paymentservice.client.DataServiceClient;
import com.nguyenquyen.dev.paymentservice.client.DatasetInfo;
import com.nguyenquyen.dev.paymentservice.dto.request.CreateTransactionRequest;
import com.nguyenquyen.dev.paymentservice.dto.response.TransactionResponse;
import com.nguyenquyen.dev.paymentservice.entity.Transaction;
import com.nguyenquyen.dev.paymentservice.repository.TransactionRepository;
import com.nguyenquyen.dev.paymentservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private DataServiceClient dataServiceClient;

    @Value("${payment.platform.commission-rate}")
    private Double commissionRate;

    @Value("${payment.provider.revenue-share}")
    private Double revenueShare;

    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        // Get current user info
        Long consumerId = UserContextHolder.getCurrentUserId();
        String consumerEmail = UserContextHolder.getCurrentUserEmail();
        String consumerName = UserContextHolder.getCurrentUserFullName();

        if (consumerId == null) {
            throw new RuntimeException("User not authenticated");
        }

        // Get dataset info from Data Service
        DatasetInfo dataset;
        try {
            dataset = dataServiceClient.getDatasetById(request.getDatasetId());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch dataset info: " + e.getMessage());
        }

        if (dataset == null) {
            throw new RuntimeException("Dataset not found");
        }

        // Calculate fees
        BigDecimal amount = request.getAmount();
        BigDecimal platformFee = amount.multiply(BigDecimal.valueOf(commissionRate))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal providerRevenue = amount.multiply(BigDecimal.valueOf(revenueShare))
                .setScale(2, RoundingMode.HALF_UP);

        // Generate transaction ID
        String transactionId = generateTransactionId();

        Transaction transaction = Transaction.builder()
                .transactionId(transactionId)
                .datasetId(request.getDatasetId())
                .datasetName(dataset.getName())
                .providerId(dataset.getProviderId())
                .providerName(dataset.getProviderName())
                .consumerId(consumerId)
                .consumerName(consumerName)
                .consumerEmail(consumerEmail)
                .transactionType(request.getTransactionType())
                .amount(amount)
                .platformFee(platformFee)
                .providerRevenue(providerRevenue)
                .currency("USD")
                .paymentMethod(request.getPaymentMethod())
                .status("PENDING")
                .subscriptionDays(request.getSubscriptionDays())
                .apiCallsLimit(request.getApiCallsLimit())
                .notes(request.getNotes())
                .build();

        if ("SUBSCRIPTION".equals(request.getTransactionType()) && request.getSubscriptionDays() != null) {
            transaction.setSubscriptionStartDate(LocalDateTime.now());
            transaction.setSubscriptionEndDate(LocalDateTime.now().plusDays(request.getSubscriptionDays()));
        }

        transaction = transactionRepository.save(transaction);

        // Process payment (mock implementation)
        boolean paymentSuccess = processPayment(transaction, request.getPaymentMethod());

        if (paymentSuccess) {
            transaction.setStatus("COMPLETED");
            transaction.setCompletedAt(LocalDateTime.now());
            transaction.setPaymentGatewayId("pi_" + UUID.randomUUID().toString().substring(0, 24));
            transactionRepository.save(transaction);

            // Notify Data Service to grant access
            try {
                dataServiceClient.grantDatasetAccess(
                        transaction.getDatasetId(),
                        transaction.getConsumerId(),
                        transaction.getTransactionType(),
                        transaction.getSubscriptionDays(),
                        transaction.getApiCallsLimit(),
                        transaction.getTransactionId()
                );
            } catch (Exception e) {
                // Log error but don't fail transaction
                System.err.println("Warning: Failed to grant dataset access: " + e.getMessage());
            }
        } else {
            transaction.setStatus("FAILED");
            transactionRepository.save(transaction);
        }

        return mapToResponse(transaction);
    }

    public List<TransactionResponse> getMyTransactions() {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }

        return transactionRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getConsumerTransactions() {
        Long consumerId = UserContextHolder.getCurrentUserId();
        if (consumerId == null) {
            throw new RuntimeException("User not authenticated");
        }

        return transactionRepository.findByConsumerId(consumerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getProviderTransactions() {
        Long providerId = UserContextHolder.getCurrentUserId();
        if (providerId == null) {
            throw new RuntimeException("User not authenticated");
        }

        return transactionRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (currentUserId == null) {
            throw new RuntimeException("User not authenticated");
        }

        if (!transaction.getConsumerId().equals(currentUserId) &&
                !transaction.getProviderId().equals(currentUserId) &&
                !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(transaction);
    }

    public TransactionResponse getTransactionByTransactionId(String transactionId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (currentUserId == null) {
            throw new RuntimeException("User not authenticated");
        }

        if (!transaction.getConsumerId().equals(currentUserId) &&
                !transaction.getProviderId().equals(currentUserId) &&
                !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(transaction);
    }

    private boolean processPayment(Transaction transaction, String paymentMethod) {
        // Mock payment processing
        // In production, integrate with Stripe, PayPal, etc.
        try {
            Thread.sleep(500); // Simulate processing time
            return true; // 100% success for mock
        } catch (InterruptedException e) {
            return false;
        }
    }

    private String generateTransactionId() {
        return "EVT_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionId(transaction.getTransactionId())
                .datasetId(transaction.getDatasetId())
                .datasetName(transaction.getDatasetName())
                .providerId(transaction.getProviderId())
                .providerName(transaction.getProviderName())
                .consumerId(transaction.getConsumerId())
                .consumerName(transaction.getConsumerName())
                .consumerEmail(transaction.getConsumerEmail())
                .transactionType(transaction.getTransactionType())
                .amount(transaction.getAmount())
                .platformFee(transaction.getPlatformFee())
                .providerRevenue(transaction.getProviderRevenue())
                .currency(transaction.getCurrency())
                .paymentMethod(transaction.getPaymentMethod())
                .status(transaction.getStatus())
                .subscriptionStartDate(transaction.getSubscriptionStartDate())
                .subscriptionEndDate(transaction.getSubscriptionEndDate())
                .subscriptionDays(transaction.getSubscriptionDays())
                .apiCallsLimit(transaction.getApiCallsLimit())
                .notes(transaction.getNotes())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .build();
    }
}