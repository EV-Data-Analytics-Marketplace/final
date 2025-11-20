package com.nguyenquyen.dev.analyticsservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String predictionId;

    @Column(nullable = false)
    private Long userId;

    @Column
    private Long datasetId;

    @Column(nullable = false, length = 50)
    private String predictionType;

    @Column(nullable = false, length = 100)
    private String modelName;

    @Column(length = 50)
    private String modelVersion;

    @Column(columnDefinition = "JSON")
    private String inputData;

    @Column(columnDefinition = "JSON")
    private String predictionResult;

    @Column
    private Double confidenceScore;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}