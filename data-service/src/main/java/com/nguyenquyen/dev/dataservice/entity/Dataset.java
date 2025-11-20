package com.nguyenquyen.dev.dataservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "datasets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dataset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private DataCategory category;

    @Column(nullable = false)
    private Long providerId; // Reference to User from Identity Service

    @Column(nullable = false, length = 200)
    private String providerName;

    // DATA_TYPE: RAW, ANALYZED, AGGREGATED, REAL_TIME
    @Column(nullable = false, length = 50)
    private String dataType;

    // FORMAT: CSV, JSON, PARQUET, API, DASHBOARD
    @Column(nullable = false, length = 50)
    private String format;

    // Status: DRAFT, PUBLISHED, ARCHIVED, SUSPENDED
    @Column(nullable = false, length = 50)
    private String status;

    // Pricing model: FREE, PAY_PER_DOWNLOAD, SUBSCRIPTION, API_BASED
    @Column(nullable = false, length = 50)
    private String pricingModel;

    @Column(nullable = false)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(length = 10)
    private String currency = "USD";

    // Usage rights: RESEARCH_ONLY, COMMERCIAL, OPEN
    @Column(nullable = false, length = 50)
    private String usageRights;

    // Geographic region
    @Column(length = 100)
    private String region;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    // Time range
    @Column
    private LocalDateTime dataStartDate;

    @Column
    private LocalDateTime dataEndDate;

    // File information
    @Column(length = 500)
    private String fileUrl;

    @Column
    private Long fileSize; // in bytes

    @Column
    private Integer recordCount;

    // API access
    @Column(length = 500)
    private String apiEndpoint;

    @Column(length = 100)
    private String apiKey;

    // Metadata
    @Column(columnDefinition = "TEXT")
    private String tags; // comma-separated

    @Column(columnDefinition = "TEXT")
    private String sampleData;

    @Column(columnDefinition = "JSON")
    private String datasetSchema; // JSON schema

    // Statistics
    @Column(nullable = false)
    @Builder.Default
    private Integer downloadCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer purchaseCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    // Privacy
    @Column(nullable = false)
    private Boolean anonymized = true;

    @Column(nullable = false)
    private Boolean gdprCompliant = true;

    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime publishedAt;

    @OneToMany(mappedBy = "dataset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DatasetAccess> accesses = new ArrayList<>();

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