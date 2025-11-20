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
public class PredictionResponse {

    private Long id;
    private String predictionId;
    private Long userId;
    private Long datasetId;
    private String predictionType;
    private String modelName;
    private String modelVersion;
    private Map<String, Object> inputData;
    private Map<String, Object> predictionResult;
    private Double confidenceScore;
    private String status;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}