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
public class CreateReportRequest {

    @NotBlank(message = "Report type is required")
    private String reportType;

    @NotNull(message = "Dataset ID is required")
    private Long datasetId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Map<String, Object> parameters;
}
