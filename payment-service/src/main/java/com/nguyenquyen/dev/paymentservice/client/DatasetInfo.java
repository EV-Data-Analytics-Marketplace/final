package com.nguyenquyen.dev.paymentservice.client;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetInfo {
    private Long id;
    private String name;
    private String code;
    private Long providerId;
    private String providerName;
    private String status;
    private BigDecimal price;
    private String pricingModel;
}