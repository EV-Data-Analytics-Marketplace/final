package com.nguyenquyen.dev.paymentservice.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "provider_revenues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderRevenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long providerId;

    @Column(nullable = false, length = 200)
    private String providerName;

    @Column(nullable = false, length = 100)
    private String providerEmail;

    // Period (monthly)
    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    // Revenue breakdown
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalRevenue;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal netRevenue;

    @Column(nullable = false)
    private Integer totalTransactions;

    @Column(nullable = false)
    private Integer totalDatasets;

    // Payment status: PENDING, PAID, PROCESSING
    @Column(nullable = false, length = 50)
    private String paymentStatus = "PENDING";

    @Column
    private LocalDateTime paidAt;

    @Column(length = 100)
    private String paymentReference;

    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

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