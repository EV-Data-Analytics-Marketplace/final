package com.nguyenquyen.dev.analyticsservice.dto.request;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateDashboardRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotBlank(message = "Dashboard type is required")
    private String dashboardType;

    private Map<String, Object> config;

    private List<Map<String, Object>> widgets;

    private Boolean isPublic = false;
}