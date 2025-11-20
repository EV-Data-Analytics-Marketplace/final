package com.nguyenquyen.dev.paymentservice.dto.response;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderRevenueResponse {

    private Long id;
    private Long providerId;
    private String providerName;
    private String providerEmail;
    private Integer year;
    private Integer month;
    private BigDecimal totalRevenue;
    private BigDecimal platformFee;
    private BigDecimal netRevenue;
    private Integer totalTransactions;
    private Integer totalDatasets;
    private String paymentStatus;
    private LocalDateTime paidAt;
    private String paymentReference;
    private LocalDateTime createdAt;
}