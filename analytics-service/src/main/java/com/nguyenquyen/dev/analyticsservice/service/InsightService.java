package com.nguyenquyen.dev.analyticsservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nguyenquyen.dev.analyticsservice.dto.response.InsightResponse;
import com.nguyenquyen.dev.analyticsservice.entity.Insight;
import com.nguyenquyen.dev.analyticsservice.repository.InsightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InsightService {

    @Autowired
    private InsightRepository insightRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<InsightResponse> getActiveInsights() {
        return insightRepository.findActiveInsights(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InsightResponse> getInsightsByDataset(Long datasetId) {
        return insightRepository.findActiveInsightsByDataset(datasetId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InsightResponse generateInsight(String insightType, Long datasetId,
                                           Map<String, Object> analysisData) {
        String insightId = generateInsightId();

        Map<String, Object> insightContent = createInsightContent(insightType, analysisData);

        Insight insight = Insight.builder()
                .insightId(insightId)
                .insightType(insightType)
                .category((String) insightContent.get("category"))
                .title((String) insightContent.get("title"))
                .description((String) insightContent.get("description"))
                .severity((String) insightContent.get("severity"))
                .confidenceScore((Double) insightContent.get("confidence"))
                .datasetId(datasetId)
                .isActive(true)
                .build();

        try {
            if (insightContent.get("relatedEntities") != null) {
                insight.setRelatedEntities(objectMapper.writeValueAsString(
                        insightContent.get("relatedEntities")));
            }
            if (insightContent.get("recommendations") != null) {
                insight.setRecommendations(objectMapper.writeValueAsString(
                        insightContent.get("recommendations")));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize insight data");
        }

        if ("HIGH".equals(insight.getSeverity())) {
            insight.setExpiresAt(LocalDateTime.now().plusDays(7));
        } else {
            insight.setExpiresAt(LocalDateTime.now().plusDays(30));
        }

        insight = insightRepository.save(insight);

        return mapToResponse(insight);
    }

    private Map<String, Object> createInsightContent(String insightType,
                                                     Map<String, Object> analysisData) {
        Map<String, Object> content = new HashMap<>();

        switch (insightType) {
            case "BATTERY_ANOMALY":
                content.put("category", "BATTERY");
                content.put("title", "Unusual Battery Degradation Detected");
                content.put("description", "Battery health declining faster than expected for vehicle age");
                content.put("severity", "HIGH");
                content.put("confidence", 0.87);
                content.put("recommendations", Arrays.asList(
                        "Schedule battery inspection",
                        "Review charging patterns",
                        "Check thermal management system"
                ));
                break;

            case "CHARGING_OPTIMIZATION":
                content.put("category", "CHARGING");
                content.put("title", "Charging Efficiency Opportunity");
                content.put("description", "Switching to off-peak charging could save 25% on energy costs");
                content.put("severity", "MEDIUM");
                content.put("confidence", 0.92);
                content.put("recommendations", Arrays.asList(
                        "Enable smart charging schedule",
                        "Charge during 23:00-06:00",
                        "Use slower charging when possible"
                ));
                break;

            case "RANGE_WARNING":
                content.put("category", "PERFORMANCE");
                content.put("title", "Range Performance Below Expected");
                content.put("description", "Actual range is 15% below manufacturer specifications");
                content.put("severity", "MEDIUM");
                content.put("confidence", 0.78);
                content.put("recommendations", Arrays.asList(
                        "Check tire pressure",
                        "Review driving style",
                        "Service vehicle systems"
                ));
                break;

            case "USAGE_TREND":
                content.put("category", "USAGE");
                content.put("title", "Increasing Usage Pattern Detected");
                content.put("description", "Daily mileage increased 30% over last month");
                content.put("severity", "LOW");
                content.put("confidence", 0.95);
                content.put("recommendations", Arrays.asList(
                        "Consider adjusting charging frequency",
                        "Monitor battery health more closely",
                        "Plan for potential battery replacement"
                ));
                break;

            default:
                content.put("category", "GENERAL");
                content.put("title", "General Insight");
                content.put("description", "Analysis completed successfully");
                content.put("severity", "LOW");
                content.put("confidence", 0.70);
                content.put("recommendations", Arrays.asList("Review detailed report"));
        }

        return content;
    }

    public void deactivateInsight(Long id) {
        Insight insight = insightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insight not found"));

        insight.setIsActive(false);
        insightRepository.save(insight);
    }

    private String generateInsightId() {
        return "INS_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
    }

    private InsightResponse mapToResponse(Insight insight) {
        try {
            return InsightResponse.builder()
                    .id(insight.getId())
                    .insightId(insight.getInsightId())
                    .insightType(insight.getInsightType())
                    .category(insight.getCategory())
                    .title(insight.getTitle())
                    .description(insight.getDescription())
                    .severity(insight.getSeverity())
                    .confidenceScore(insight.getConfidenceScore())
                    .datasetId(insight.getDatasetId())
                    .relatedEntities(insight.getRelatedEntities() != null ?
                            objectMapper.readValue(insight.getRelatedEntities(), Map.class) : null)
                    .recommendations(insight.getRecommendations() != null ?
                            objectMapper.readValue(insight.getRecommendations(), List.class) : null)
                    .isActive(insight.getIsActive())
                    .createdAt(insight.getCreatedAt())
                    .expiresAt(insight.getExpiresAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to map insight to response");
        }
    }
}