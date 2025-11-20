package com.nguyenquyen.dev.analyticsservice.controller;

import com.nguyenquyen.dev.analyticsservice.dto.response.AnalyticsSummaryResponse;
import com.nguyenquyen.dev.analyticsservice.dto.response.InsightResponse;
import com.nguyenquyen.dev.analyticsservice.entity.AIPrediction;
import com.nguyenquyen.dev.analyticsservice.entity.AnalysisReport;
import com.nguyenquyen.dev.analyticsservice.entity.DataQualityScore;
import com.nguyenquyen.dev.analyticsservice.entity.Insight;
import com.nguyenquyen.dev.analyticsservice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private AnalysisReportRepository reportRepository;

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired
    private AIPredictionRepository predictionRepository;

    @Autowired
    private InsightRepository insightRepository;

    @Autowired
    private DataQualityScoreRepository qualityRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getAnalyticsStats() {
        try {
            Long totalReports = reportRepository.count();
            Long totalDashboards = dashboardRepository.count();
            Long totalPredictions = predictionRepository.count();
            Long totalInsights = insightRepository.count();

            Map<String, Long> reportsByType = reportRepository.findAll().stream()
                    .collect(Collectors.groupingBy(AnalysisReport::getReportType, Collectors.counting()));

            Map<String, Long> predictionsByType = predictionRepository.findAll().stream()
                    .collect(Collectors.groupingBy(AIPrediction::getPredictionType, Collectors.counting()));

            List<InsightResponse> recentInsights = insightRepository
                    .findActiveInsights(LocalDateTime.now()).stream()
                    .limit(10)
                    .map(this::mapInsightToResponse)
                    .collect(Collectors.toList());

            Double avgQuality = qualityRepository.findAll().stream()
                    .mapToDouble(DataQualityScore::getOverallScore)
                    .average()
                    .orElse(0.0);

            AnalyticsSummaryResponse summary = AnalyticsSummaryResponse.builder()
                    .totalReports(totalReports)
                    .totalDashboards(totalDashboards)
                    .totalPredictions(totalPredictions)
                    .totalInsights(totalInsights)
                    .averageDataQuality(avgQuality)
                    .reportsByType(reportsByType)
                    .predictionsByType(predictionsByType)
                    .recentInsights(recentInsights)
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch analytics stats", "error", e.getMessage()));
        }
    }

    private InsightResponse mapInsightToResponse(Insight insight) {
        return InsightResponse.builder()
                .id(insight.getId())
                .insightId(insight.getInsightId())
                .title(insight.getTitle())
                .description(insight.getDescription())
                .severity(insight.getSeverity())
                .category(insight.getCategory())
                .createdAt(insight.getCreatedAt())
                .build();
    }
}