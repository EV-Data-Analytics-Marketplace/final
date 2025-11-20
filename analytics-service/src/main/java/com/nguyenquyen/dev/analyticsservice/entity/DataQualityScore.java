package com.nguyenquyen.dev.analyticsservice.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "data_quality_scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataQualityScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long datasetId;

    @Column(nullable = false)
    private Double completenessScore;

    @Column(nullable = false)
    private Double accuracyScore;

    @Column(nullable = false)
    private Double consistencyScore;

    @Column(nullable = false)
    private Double timelinessScore;

    @Column(nullable = false)
    private Double overallScore;

    @Column(columnDefinition = "JSON")
    private String issues;

    @Column(columnDefinition = "JSON")
    private String recommendations;

    @Column(nullable = false)
    private LocalDateTime assessedAt;

    @PrePersist
    protected void onCreate() {
        assessedAt = LocalDateTime.now();
    }
}