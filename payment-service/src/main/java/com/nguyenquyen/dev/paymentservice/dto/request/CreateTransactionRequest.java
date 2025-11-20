package com.nguyenquyen.dev.paymentservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull(message = "Dataset ID is required")
    private Long datasetId;

    @NotBlank(message = "Transaction type is required")
    private String transactionType; // PURCHASE, SUBSCRIPTION, API_ACCESS

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CREDIT_CARD, PAYPAL, BANK_TRANSFER

    private Long paymentMethodId; // Reference to saved payment method

    private Integer subscriptionDays;
    private Integer apiCallsLimit;
    private String notes;
}