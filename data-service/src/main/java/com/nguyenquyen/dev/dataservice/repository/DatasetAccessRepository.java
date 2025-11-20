package com.nguyenquyen.dev.dataservice.repository;
import com.nguyenquyen.dev.dataservice.entity.DatasetAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface DatasetAccessRepository extends JpaRepository<DatasetAccess, Long> {

    List<DatasetAccess> findByUserId(Long userId);

    List<DatasetAccess> findByDatasetId(Long datasetId);

    Optional<DatasetAccess> findByUserIdAndDatasetIdAndStatus(Long userId, Long datasetId, String status);

    @Query("SELECT da FROM DatasetAccess da WHERE da.userId = :userId " +
            "AND da.dataset.id = :datasetId " +
            "AND da.status = 'ACTIVE' " +
            "AND (da.expiresAt IS NULL OR da.expiresAt > :now)")
    Optional<DatasetAccess> findActiveAccess(@Param("userId") Long userId,
                                             @Param("datasetId") Long datasetId,
                                             @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(DISTINCT da.userId) FROM DatasetAccess da WHERE da.dataset.id = :datasetId")
    Long countUniqueUsers(@Param("datasetId") Long datasetId);

    @Query("SELECT COUNT(DISTINCT da.userId) FROM DatasetAccess da")
    Long countTotalConsumers();

    Boolean existsByUserIdAndDatasetId(Long userId, Long datasetId);
}
