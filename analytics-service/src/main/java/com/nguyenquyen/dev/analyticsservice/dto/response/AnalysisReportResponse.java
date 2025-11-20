package com.nguyenquyen.dev.analyticsservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisReportResponse {

    private Long id;
    private String reportId;
    private Long userId;
    private String userEmail;
    private String userName;
    private String reportType;
    private Long datasetId;
    private String datasetName;
    private String title;
    private String description;
    private String status;
    private Map<String, Object> parameters;
    private Map<String, Object> results;
    private List<Map<String, Object>> charts;
    private List<Map<String, Object>> insights;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}