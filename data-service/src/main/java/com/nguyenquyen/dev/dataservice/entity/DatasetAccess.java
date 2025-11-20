package com.nguyenquyen.dev.dataservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dataset_accesses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatasetAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dataset_id", nullable = false)
    private Dataset dataset;

    @Column(nullable = false)
    private Long userId; // Reference to User from Identity Service

    @Column(nullable = false, length = 100)
    private String userEmail;

    @Column(nullable = false, length = 100)
    private String userName;

    // ACCESS_TYPE: DOWNLOAD, API, SUBSCRIPTION, VIEW
    @Column(nullable = false, length = 50)
    private String accessType;

    // Status: ACTIVE, EXPIRED, REVOKED
    @Column(nullable = false, length = 50)
    private String status;

    @Column
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private BigDecimal pricePaid = BigDecimal.ZERO;

    @Column(length = 100)
    private String transactionId; // Reference to Payment Service

    // API Access
    @Column(length = 500)
    private String apiAccessToken;

    @Column(nullable = false)
    private Integer apiCallsLimit = 0;

    @Column(nullable = false)
    private Integer apiCallsUsed = 0;

    // Download tracking
    @Column(nullable = false)
    private Integer downloadCount = 0;

    @Column
    private LocalDateTime lastAccessedAt;

    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime grantedAt;

    @PrePersist
    protected void onCreate() {
        grantedAt = LocalDateTime.now();
    }
}