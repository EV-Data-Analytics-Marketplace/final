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
public class RefundResponse {

    private Long id;
    private String refundId;
    private Long transactionId;
    private String transactionRef;
    private BigDecimal amount;
    private String currency;
    private String reason;
    private String description;
    private String status;
    private Long requestedBy;
    private String requestedByName;
    private Long approvedBy;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}