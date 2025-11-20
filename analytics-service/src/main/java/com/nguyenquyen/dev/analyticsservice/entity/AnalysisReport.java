package com.nguyenquyen.dev.analyticsservice.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "analysis_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String reportId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String userEmail;

    @Column(nullable = false, length = 100)
    private String userName;

    @Column(nullable = false, length = 50)
    private String reportType;

    @Column
    private Long datasetId;

    @Column(length = 200)
    private String datasetName;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(columnDefinition = "JSON")
    private String parameters;

    @Column(columnDefinition = "JSON")
    private String results;

    @Column(columnDefinition = "JSON")
    private String charts;

    @Column(columnDefinition = "JSON")
    private String insights;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

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
