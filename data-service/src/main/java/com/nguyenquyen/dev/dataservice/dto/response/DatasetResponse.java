package com.nguyenquyen.dev.dataservice.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatasetResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long providerId;
    private String providerName;
    private String dataType;
    private String format;
    private String status;
    private String pricingModel;
    private BigDecimal price;
    private String currency;
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
    private Integer downloadCount;
    private Integer viewCount;
    private Integer purchaseCount;
    private Double rating;
    private Integer ratingCount;
    private Boolean anonymized;
    private Boolean gdprCompliant;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private Boolean hasAccess; // Whether current user has access
}

