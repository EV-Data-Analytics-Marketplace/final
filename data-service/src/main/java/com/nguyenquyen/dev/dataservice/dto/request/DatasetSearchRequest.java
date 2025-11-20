package com.nguyenquyen.dev.dataservice.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetSearchRequest {

    private String keyword;
    private Long categoryId;
    private String dataType;
    private String format;
    private String pricingModel;
    private String region;
    private String country;
    private String usageRights;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String sortBy = "createdAt"; // createdAt, price, rating, downloadCount
    private String sortDirection = "DESC"; // ASC, DESC
    private Integer page = 0;
    private Integer size = 20;
}
