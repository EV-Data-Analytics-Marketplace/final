package com.nguyenquyen.dev.dataservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Data type is required")
    private String dataType;

    @NotBlank(message = "Format is required")
    private String format;

    @NotBlank(message = "Pricing model is required")
    private String pricingModel;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String currency = "USD";

    @NotBlank(message = "Usage rights is required")
    private String usageRights;

    private String region;
    private String country;
    private String city;

    private LocalDateTime dataStartDate;
    private LocalDateTime dataEndDate;

    private String fileUrl;
    private Long fileSize;
    private Integer recordCount;

    private String apiEndpoint;

    private String tags;
    private String sampleData;
    private String schema;

    private Boolean anonymized = true;
    private Boolean gdprCompliant = true;
}
