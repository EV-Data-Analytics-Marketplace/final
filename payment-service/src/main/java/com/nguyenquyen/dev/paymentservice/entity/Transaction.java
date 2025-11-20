package com.nguyenquyen.dev.paymentservice.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionId; // EVT_xxxxx

    // Reference to Data Service
    @Column(nullable = false)
    private Long datasetId;

    @Column(nullable = false, length = 200)
    private String datasetName;

    @Column(nullable = false)
    private Long providerId;

    @Column(nullable = false, length = 200)
    private String providerName;

    @Column(nullable = false)
    private Long consumerId;

    @Column(nullable = false, length = 200)
    private String consumerName;

    @Column(nullable = false, length = 100)
    private String consumerEmail;

    // PURCHASE, SUBSCRIPTION, API_ACCESS
    @Column(nullable = false, length = 50)
    private String transactionType;

    // Payment amounts
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal providerRevenue;

    @Column(length = 10)
    private String currency = "USD";

    // Payment method: CREDIT_CARD, PAYPAL, BANK_TRANSFER, CRYPTO
    @Column(nullable = false, length = 50)
    private String paymentMethod;

    // Status: PENDING, COMPLETED, FAILED, REFUNDED, CANCELLED
    @Column(nullable = false, length = 50)
    private String status;

    // Payment gateway reference
    @Column(length = 200)
    private String paymentGatewayId; // Stripe payment intent ID

    @Column(columnDefinition = "TEXT")
    private String paymentDetails; // JSON string with payment details

    // Subscription details
    @Column
    private LocalDateTime subscriptionStartDate;

    @Column
    private LocalDateTime subscriptionEndDate;

    @Column
    private Integer subscriptionDays;

    // API access details
    @Column
    private Integer apiCallsLimit;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}