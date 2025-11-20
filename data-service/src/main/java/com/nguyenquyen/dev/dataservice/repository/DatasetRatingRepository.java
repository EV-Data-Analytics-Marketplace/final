package com.nguyenquyen.dev.dataservice.repository;

import com.nguyenquyen.dev.dataservice.entity.DatasetRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DatasetRatingRepository extends JpaRepository<DatasetRating, Long> {

    Optional<DatasetRating> findByDatasetIdAndUserId(Long datasetId, Long userId);

    List<DatasetRating> findByDatasetId(Long datasetId);

    List<DatasetRating> findByUserId(Long userId);

    @Query("SELECT AVG(dr.rating) FROM DatasetRating dr WHERE dr.dataset.id = :datasetId")
    Double calculateAverageRating(@Param("datasetId") Long datasetId);

    @Query("SELECT COUNT(dr) FROM DatasetRating dr WHERE dr.dataset.id = :datasetId")
    Long countRatings(@Param("datasetId") Long datasetId);

    Boolean existsByDatasetIdAndUserId(Long datasetId, Long userId);
}