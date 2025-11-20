package com.nguyenquyen.dev.paymentservice.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;


import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "refunds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String refundId; // EVR_xxxxx

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 10)
    private String currency = "USD";

    // Reason: CUSTOMER_REQUEST, PROVIDER_REQUEST, QUALITY_ISSUE, TECHNICAL_ERROR
    @Column(nullable = false, length = 50)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Status: PENDING, APPROVED, REJECTED, COMPLETED
    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false)
    private Long requestedBy;

    @Column(length = 200)
    private String requestedByName;

    @Column
    private Long approvedBy;

    @Column(length = 200)
    private String approvedByName;

    @Column
    private LocalDateTime approvedAt;

    @Column(length = 200)
    private String paymentGatewayRefundId;

    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}