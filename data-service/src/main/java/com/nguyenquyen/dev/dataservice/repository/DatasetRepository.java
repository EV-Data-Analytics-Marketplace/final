package com.nguyenquyen.dev.dataservice.repository;

import com.nguyenquyen.dev.dataservice.entity.Dataset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {

    Optional<Dataset> findByCode(String code);

    List<Dataset> findByProviderId(Long providerId);

    List<Dataset> findByStatus(String status);

    List<Dataset> findByCategoryId(Long categoryId);

    List<Dataset> findByStatusOrderByPublishedAtDesc(String status);

    @Query("SELECT d FROM Dataset d WHERE d.status = :status AND " +
            "(:keyword IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(d.tags) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Dataset> searchDatasets(@Param("status") String status,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);

    @Query("SELECT d FROM Dataset d WHERE d.status = :status " +
            "AND (:categoryId IS NULL OR d.category.id = :categoryId) " +
            "AND (:dataType IS NULL OR d.dataType = :dataType) " +
            "AND (:format IS NULL OR d.format = :format) " +
            "AND (:pricingModel IS NULL OR d.pricingModel = :pricingModel) " +
            "AND (:region IS NULL OR d.region = :region) " +
            "AND (:country IS NULL OR d.country = :country) " +
            "AND (:usageRights IS NULL OR d.usageRights = :usageRights) " +
            "AND (:minPrice IS NULL OR d.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR d.price <= :maxPrice)")
    Page<Dataset> advancedSearch(@Param("status") String status,
                                 @Param("categoryId") Long categoryId,
                                 @Param("dataType") String dataType,
                                 @Param("format") String format,
                                 @Param("pricingModel") String pricingModel,
                                 @Param("region") String region,
                                 @Param("country") String country,
                                 @Param("usageRights") String usageRights,
                                 @Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice,
                                 Pageable pageable);

    @Query("SELECT COUNT(d) FROM Dataset d WHERE d.status = 'PUBLISHED'")
    Long countPublishedDatasets();

    @Query("SELECT SUM(d.downloadCount) FROM Dataset d")
    Long sumTotalDownloads();

    @Query("SELECT SUM(d.purchaseCount) FROM Dataset d")
    Long sumTotalPurchases();

    @Query("SELECT AVG(d.rating) FROM Dataset d WHERE d.ratingCount > 0")
    Double calculateAverageRating();

    Boolean existsByCode(String code);
}