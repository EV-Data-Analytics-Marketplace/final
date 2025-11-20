package com.nguyenquyen.dev.paymentservice.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentStatsResponse {

    private Long totalTransactions;
    private Long completedTransactions;
    private Long pendingTransactions;
    private Long failedTransactions;
    private BigDecimal totalRevenue;
    private BigDecimal platformFees;
    private BigDecimal providerRevenues;
    private Long totalRefunds;
    private BigDecimal totalRefundAmount;
    private Map<String, Long> transactionsByType;
    private Map<String, BigDecimal> revenueByMonth;
    private LocalDateTime timestamp;
}