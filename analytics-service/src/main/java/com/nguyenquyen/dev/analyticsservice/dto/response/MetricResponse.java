package com.nguyenquyen.dev.analyticsservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricResponse {

    private String metricName;
    private Double value;
    private String unit;
    private String period;
    private LocalDateTime timestamp;
    private Map<String, Object> metadata;
}
