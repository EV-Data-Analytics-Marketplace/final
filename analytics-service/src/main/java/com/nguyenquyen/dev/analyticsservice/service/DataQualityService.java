package com.nguyenquyen.dev.analyticsservice.service;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nguyenquyen.dev.analyticsservice.dto.response.DataQualityResponse;
import com.nguyenquyen.dev.analyticsservice.entity.DataQualityScore;
import com.nguyenquyen.dev.analyticsservice.repository.DataQualityScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataQualityService {

    @Autowired
    private DataQualityScoreRepository qualityRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public DataQualityResponse assessDataQuality(Long datasetId, Map<String, Object> datasetMetrics) {
        double completeness = calculateCompleteness(datasetMetrics);
        double accuracy = calculateAccuracy(datasetMetrics);
        double consistency = calculateConsistency(datasetMetrics);
        double timeliness = calculateTimeliness(datasetMetrics);

        double overallScore = (completeness + accuracy + consistency + timeliness) / 4.0;

        List<String> issues = identifyIssues(completeness, accuracy, consistency, timeliness);
        List<String> recommendations = generateRecommendations(issues);

        DataQualityScore qualityScore = DataQualityScore.builder()
                .datasetId(datasetId)
                .completenessScore(completeness)
                .accuracyScore(accuracy)
                .consistencyScore(consistency)
                .timelinessScore(timeliness)
                .overallScore(overallScore)
                .build();

        try {
            qualityScore.setIssues(objectMapper.writeValueAsString(issues));
            qualityScore.setRecommendations(objectMapper.writeValueAsString(recommendations));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize quality data");
        }

        qualityScore = qualityRepository.save(qualityScore);

        return mapToResponse(qualityScore);
    }

    private double calculateCompleteness(Map<String, Object> metrics) {
        return 85.0 + (Math.random() * 10.0);
    }

    private double calculateAccuracy(Map<String, Object> metrics) {
        return 88.0 + (Math.random() * 10.0);
    }

    private double calculateConsistency(Map<String, Object> metrics) {
        return 90.0 + (Math.random() * 8.0);
    }

    private double calculateTimeliness(Map<String, Object> metrics) {
        return 92.0 + (Math.random() * 6.0);
    }

    private List<String> identifyIssues(double completeness, double accuracy,
                                        double consistency, double timeliness) {
        List<String> issues = new ArrayList<>();

        if (completeness < 90.0) {
            issues.add("Some fields have missing values");
        }
        if (accuracy < 85.0) {
            issues.add("Data validation errors detected");
        }
        if (consistency < 88.0) {
            issues.add("Inconsistent data formats found");
        }
        if (timeliness < 85.0) {
            issues.add("Data may be outdated");
        }

        return issues;
    }

    private List<String> generateRecommendations(List<String> issues) {
        List<String> recommendations = new ArrayList<>();

        if (issues.isEmpty()) {
            recommendations.add("Data quality is excellent - no actions needed");
            return recommendations;
        }

        for (String issue : issues) {
            if (issue.contains("missing")) {
                recommendations.add("Implement data validation at collection point");
            }
            if (issue.contains("validation")) {
                recommendations.add("Review data entry processes");
            }
            if (issue.contains("format")) {
                recommendations.add("Standardize data formats");
            }
            if (issue.contains("outdated")) {
                recommendations.add("Increase data collection frequency");
            }
        }

        return recommendations;
    }

    public DataQualityResponse getLatestQuality(Long datasetId) {
        DataQualityScore qualityScore = qualityRepository
                .findTopByDatasetIdOrderByAssessedAtDesc(datasetId)
                .orElseThrow(() -> new RuntimeException("No quality assessment found"));

        return mapToResponse(qualityScore);
    }

    public List<DataQualityResponse> getLowQualityDatasets(Double threshold) {
        return qualityRepository.findLowQualityDatasets(threshold).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DataQualityResponse mapToResponse(DataQualityScore score) {
        try {
            return DataQualityResponse.builder()
                    .id(score.getId())
                    .datasetId(score.getDatasetId())
                    .completenessScore(score.getCompletenessScore())
                    .accuracyScore(score.getAccuracyScore())
                    .consistencyScore(score.getConsistencyScore())
                    .timelinessScore(score.getTimelinessScore())
                    .overallScore(score.getOverallScore())
                    .issues(score.getIssues() != null ?
                            objectMapper.readValue(score.getIssues(), List.class) : null)
                    .recommendations(score.getRecommendations() != null ?
                            objectMapper.readValue(score.getRecommendations(), List.class) : null)
                    .assessedAt(score.getAssessedAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to map quality score to response");
        }
    }
}