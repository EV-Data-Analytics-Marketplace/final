package com.nguyenquyen.dev.analyticsservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryResponse {

    private Long totalReports;
    private Long totalDashboards;
    private Long totalPredictions;
    private Long totalInsights;
    private Double averageDataQuality;
    private Map<String, Long> reportsByType;
    private Map<String, Long> predictionsByType;
    private List<InsightResponse> recentInsights;
    private LocalDateTime timestamp;
}