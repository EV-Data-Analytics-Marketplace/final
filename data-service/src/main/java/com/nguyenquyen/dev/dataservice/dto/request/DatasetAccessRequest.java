package com.nguyenquyen.dev.dataservice.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetAccessRequest {

    @NotNull(message = "Dataset ID is required")
    private Long datasetId;

    @NotBlank(message = "Access type is required")
    private String accessType; // DOWNLOAD, API, SUBSCRIPTION

    private Integer durationDays; // For subscription
    private Integer apiCallsLimit; // For API access
}
