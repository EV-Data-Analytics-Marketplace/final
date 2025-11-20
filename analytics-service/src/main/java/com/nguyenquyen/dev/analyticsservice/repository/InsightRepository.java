package com.nguyenquyen.dev.analyticsservice.repository;

import com.nguyenquyen.dev.analyticsservice.entity.Insight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InsightRepository extends JpaRepository<Insight, Long> {

    Optional<Insight> findByInsightId(String insightId);

    List<Insight> findByInsightType(String insightType);

    List<Insight> findByCategory(String category);

    List<Insight> findByDatasetId(Long datasetId);

    List<Insight> findByIsActive(Boolean isActive);

    @Query("SELECT i FROM Insight i WHERE i.isActive = true " +
            "AND (i.expiresAt IS NULL OR i.expiresAt > :now) " +
            "ORDER BY i.confidenceScore DESC, i.createdAt DESC")
    List<Insight> findActiveInsights(@Param("now") LocalDateTime now);

    @Query("SELECT i FROM Insight i WHERE i.datasetId = :datasetId " +
            "AND i.isActive = true ORDER BY i.confidenceScore DESC")
    List<Insight> findActiveInsightsByDataset(@Param("datasetId") Long datasetId);

    Boolean existsByInsightId(String insightId);
}