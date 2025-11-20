package com.nguyenquyen.dev.dataservice.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatasetAccessResponse {

    private Long id;
    private Long datasetId;
    private String datasetName;
    private Long userId;
    private String userEmail;
    private String userName;
    private String accessType;
    private String status;
    private LocalDateTime expiresAt;
    private BigDecimal pricePaid;
    private String transactionId;
    private String apiAccessToken;
    private Integer apiCallsLimit;
    private Integer apiCallsUsed;
    private Integer downloadCount;
    private LocalDateTime lastAccessedAt;
    private LocalDateTime grantedAt;
}
