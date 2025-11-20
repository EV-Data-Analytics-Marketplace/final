package com.nguyenquyen.dev.dataservice.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatasetStatsResponse {

    private Long totalDatasets;
    private Long publishedDatasets;
    private Long totalDownloads;
    private Long totalPurchases;
    private BigDecimal totalRevenue;
    private Double averageRating;
    private Long totalProviders;
    private Long totalConsumers;
    private Map<String, Long> datasetsByCategory;
    private Map<String, Long> datasetsByType;
    private LocalDateTime timestamp;
}