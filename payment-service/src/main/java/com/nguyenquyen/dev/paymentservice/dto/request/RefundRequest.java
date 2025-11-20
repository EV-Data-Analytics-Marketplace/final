package com.nguyenquyen.dev.paymentservice.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {

    @NotNull(message = "Transaction ID is required")
    private Long transactionId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotBlank(message = "Reason is required")
    private String reason; // CUSTOMER_REQUEST, PROVIDER_REQUEST, QUALITY_ISSUE, TECHNICAL_ERROR

    private String description;
}