package com.nguyenquyen.dev.analyticsservice.dto.request;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;


import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {

    @NotBlank(message = "Prediction type is required")
    private String predictionType;

    private Long datasetId;

    @NotNull(message = "Input data is required")
    private Map<String, Object> inputData;

    private String modelVersion;
}
