package com.nguyenquyen.dev.analyticsservice.repository;

import com.nguyenquyen.dev.analyticsservice.entity.AnalyticsMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface AnalyticsMetricRepository extends JpaRepository<AnalyticsMetric, Long> {

    List<AnalyticsMetric> findByMetricType(String metricType);

    List<AnalyticsMetric> findByEntityTypeAndEntityId(String entityType, Long entityId);

    @Query("SELECT am FROM AnalyticsMetric am WHERE am.entityType = :entityType " +
            "AND am.entityId = :entityId AND am.metricName = :metricName " +
            "AND am.periodStart >= :startDate AND am.periodEnd <= :endDate " +
            "ORDER BY am.periodStart ASC")
    List<AnalyticsMetric> findMetricsByPeriod(@Param("entityType") String entityType,
                                              @Param("entityId") Long entityId,
                                              @Param("metricName") String metricName,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(am.metricValue) FROM AnalyticsMetric am " +
            "WHERE am.entityType = :entityType AND am.entityId = :entityId " +
            "AND am.metricName = :metricName")
    Double calculateAverageMetric(@Param("entityType") String entityType,
                                  @Param("entityId") Long entityId,
                                  @Param("metricName") String metricName);
}