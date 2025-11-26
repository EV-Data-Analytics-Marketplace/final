package com.nguyenquyen.dev.analyticsservice.repository;

import com.nguyenquyen.dev.analyticsservice.entity.AnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {

    Optional<AnalysisReport> findByReportId(String reportId);

    List<AnalysisReport> findByUserId(Long userId);

    List<AnalysisReport> findByDatasetId(Long datasetId);

    List<AnalysisReport> findByReportType(String reportType);

    List<AnalysisReport> findByStatus(String status);

    @Query("SELECT ar FROM AnalysisReport ar WHERE ar.userId = :userId " +
            "AND ar.reportType = :reportType ORDER BY ar.createdAt DESC")
    List<AnalysisReport> findByUserIdAndReportType(@Param("userId") Long userId,
                                                   @Param("reportType") String reportType);

    Boolean existsByReportId(String reportId);
}