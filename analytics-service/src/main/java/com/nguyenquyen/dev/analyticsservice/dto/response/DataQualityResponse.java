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
public class DataQualityResponse {

    private Long id;
    private Long datasetId;
    private Double completenessScore;
    private Double accuracyScore;
    private Double consistencyScore;
    private Double timelinessScore;
    private Double overallScore;
    private List<String> issues;
    private List<String> recommendations;
    private LocalDateTime assessedAt;
}