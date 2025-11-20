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
public class InsightResponse {

    private Long id;
    private String insightId;
    private String insightType;
    private String category;
    private String title;
    private String description;
    private String severity;
    private Double confidenceScore;
    private Long datasetId;
    private Map<String, Object> relatedEntities;
    private List<String> recommendations;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}