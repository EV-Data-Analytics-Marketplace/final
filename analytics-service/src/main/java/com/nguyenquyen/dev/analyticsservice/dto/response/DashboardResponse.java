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
public class DashboardResponse {

    private Long id;
    private String dashboardId;
    private Long userId;
    private String userEmail;
    private String name;
    private String description;
    private String dashboardType;
    private Map<String, Object> config;
    private List<Map<String, Object>> widgets;
    private Boolean isPublic;
    private Boolean isTemplate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}