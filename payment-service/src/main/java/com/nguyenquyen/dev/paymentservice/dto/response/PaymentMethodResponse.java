package com.nguyenquyen.dev.paymentservice.dto.response;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethodResponse {

    private Long id;
    private Long userId;
    private String userEmail;
    private String type;
    private String cardBrand;
    private String cardLast4;
    private String cardExpMonth;
    private String cardExpYear;
    private String paypalEmail;
    private String bankName;
    private String bankAccountLast4;
    private Boolean isDefault;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
