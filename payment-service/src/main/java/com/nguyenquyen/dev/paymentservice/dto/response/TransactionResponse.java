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
public class TransactionResponse {

    private Long id;
    private String transactionId;
    private Long datasetId;
    private String datasetName;
    private Long providerId;
    private String providerName;
    private Long consumerId;
    private String consumerName;
    private String consumerEmail;
    private String transactionType;
    private BigDecimal amount;
    private BigDecimal platformFee;
    private BigDecimal providerRevenue;
    private String currency;
    private String paymentMethod;
    private String status;
    private LocalDateTime subscriptionStartDate;
    private LocalDateTime subscriptionEndDate;
    private Integer subscriptionDays;
    private Integer apiCallsLimit;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}