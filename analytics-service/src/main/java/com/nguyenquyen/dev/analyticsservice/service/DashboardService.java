package com.nguyenquyen.dev.analyticsservice.service;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nguyenquyen.dev.analyticsservice.dto.request.CreateDashboardRequest;
import com.nguyenquyen.dev.analyticsservice.dto.response.DashboardResponse;
import com.nguyenquyen.dev.analyticsservice.entity.Dashboard;
import com.nguyenquyen.dev.analyticsservice.repository.DashboardRepository;
import com.nguyenquyen.dev.analyticsservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
@Service
public class DashboardService {

    @Autowired
    private DashboardRepository dashboardRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public DashboardResponse createDashboard(CreateDashboardRequest request) {
        Long userId = UserContextHolder.getCurrentUserId();
        String userEmail = UserContextHolder.getCurrentUserEmail();

        String dashboardId = generateDashboardId();

        Dashboard dashboard = Dashboard.builder()
                .dashboardId(dashboardId)
                .userId(userId)
                .userEmail(userEmail)
                .name(request.getName())
                .description(request.getDescription())
                .dashboardType(request.getDashboardType())
                .isPublic(request.getIsPublic())
                .isTemplate(false)
                .build();

        try {
            if (request.getConfig() != null) {
                dashboard.setConfig(objectMapper.writeValueAsString(request.getConfig()));
            }
            if (request.getWidgets() != null) {
                dashboard.setWidgets(objectMapper.writeValueAsString(request.getWidgets()));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize dashboard data");
        }

        dashboard = dashboardRepository.save(dashboard);

        return mapToResponse(dashboard);
    }

    public DashboardResponse updateDashboard(Long id, CreateDashboardRequest request) {
        Dashboard dashboard = dashboardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dashboard not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!dashboard.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        dashboard.setName(request.getName());
        dashboard.setDescription(request.getDescription());
        dashboard.setDashboardType(request.getDashboardType());
        dashboard.setIsPublic(request.getIsPublic());

        try {
            if (request.getConfig() != null) {
                dashboard.setConfig(objectMapper.writeValueAsString(request.getConfig()));
            }
            if (request.getWidgets() != null) {
                dashboard.setWidgets(objectMapper.writeValueAsString(request.getWidgets()));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize dashboard data");
        }

        dashboard = dashboardRepository.save(dashboard);

        return mapToResponse(dashboard);
    }

    public List<DashboardResponse> getMyDashboards() {
        Long userId = UserContextHolder.getCurrentUserId();
        return dashboardRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DashboardResponse> getPublicDashboards() {
        return dashboardRepository.findByIsPublic(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DashboardResponse getDashboardById(Long id) {
        Dashboard dashboard = dashboardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dashboard not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!dashboard.getIsPublic() && !dashboard.getUserId().equals(currentUserId)
                && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(dashboard);
    }

    public void deleteDashboard(Long id) {
        Dashboard dashboard = dashboardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dashboard not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!dashboard.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        dashboardRepository.delete(dashboard);
    }

    private String generateDashboardId() {
        return "DSH_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
    }

    private DashboardResponse mapToResponse(Dashboard dashboard) {
        try {
            return DashboardResponse.builder()
                    .id(dashboard.getId())
                    .dashboardId(dashboard.getDashboardId())
                    .userId(dashboard.getUserId())
                    .userEmail(dashboard.getUserEmail())
                    .name(dashboard.getName())
                    .description(dashboard.getDescription())
                    .dashboardType(dashboard.getDashboardType())
                    .config(dashboard.getConfig() != null ?
                            objectMapper.readValue(dashboard.getConfig(), Map.class) : null)
                    .widgets(dashboard.getWidgets() != null ?
                            objectMapper.readValue(dashboard.getWidgets(), List.class) : null)
                    .isPublic(dashboard.getIsPublic())
                    .isTemplate(dashboard.getIsTemplate())
                    .createdAt(dashboard.getCreatedAt())
                    .updatedAt(dashboard.getUpdatedAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to map dashboard to response");
        }
    }
}
