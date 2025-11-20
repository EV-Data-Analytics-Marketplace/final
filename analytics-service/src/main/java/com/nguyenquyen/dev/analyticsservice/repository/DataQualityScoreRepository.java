package com.nguyenquyen.dev.analyticsservice.repository;

import com.nguyenquyen.dev.analyticsservice.entity.DataQualityScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DataQualityScoreRepository extends JpaRepository<DataQualityScore, Long> {

    Optional<DataQualityScore> findTopByDatasetIdOrderByAssessedAtDesc(Long datasetId);

    List<DataQualityScore> findByDatasetId(Long datasetId);

    @Query("SELECT dqs FROM DataQualityScore dqs WHERE dqs.overallScore < :threshold " +
            "ORDER BY dqs.overallScore ASC")
    List<DataQualityScore> findLowQualityDatasets(@Param("threshold") Double threshold);

    @Query("SELECT AVG(dqs.overallScore) FROM DataQualityScore dqs " +
            "WHERE dqs.datasetId = :datasetId")
    Double calculateAverageQuality(@Param("datasetId") Long datasetId);
}