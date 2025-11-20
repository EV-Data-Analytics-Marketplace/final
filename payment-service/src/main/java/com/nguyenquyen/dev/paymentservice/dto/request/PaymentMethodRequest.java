package com.nguyenquyen.dev.paymentservice.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodRequest {

    @NotBlank(message = "Type is required")
    private String type; // CREDIT_CARD, PAYPAL, BANK_TRANSFER

    // Credit card fields
    private String cardNumber;
    private String cardHolderName;
    private String cardExpMonth;
    private String cardExpYear;
    private String cardCvv;

    // PayPal
    private String paypalEmail;

    // Bank transfer
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountName;

    private Boolean isDefault = false;
}