package com.nguyenquyen.dev.analyticsservice.repository;

import com.nguyenquyen.dev.analyticsservice.entity.AIPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AIPredictionRepository extends JpaRepository<AIPrediction, Long> {

    Optional<AIPrediction> findByPredictionId(String predictionId);

    List<AIPrediction> findByUserId(Long userId);

    List<AIPrediction> findByDatasetId(Long datasetId);

    List<AIPrediction> findByPredictionType(String predictionType);

    List<AIPrediction> findByStatus(String status);

    @Query("SELECT ap FROM AIPrediction ap WHERE ap.userId = :userId " +
            "AND ap.predictionType = :predictionType ORDER BY ap.createdAt DESC")
    List<AIPrediction> findByUserIdAndPredictionType(@Param("userId") Long userId,
                                                     @Param("predictionType") String predictionType);

    Boolean existsByPredictionId(String predictionId);
}