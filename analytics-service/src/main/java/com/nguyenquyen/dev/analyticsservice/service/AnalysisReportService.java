package com.nguyenquyen.dev.analyticsservice.service;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nguyenquyen.dev.analyticsservice.client.DataServiceClient;
import com.nguyenquyen.dev.analyticsservice.client.DatasetInfo;
import com.nguyenquyen.dev.analyticsservice.dto.request.CreateReportRequest;
import com.nguyenquyen.dev.analyticsservice.dto.response.AnalysisReportResponse;
import com.nguyenquyen.dev.analyticsservice.entity.AnalysisReport;
import com.nguyenquyen.dev.analyticsservice.repository.AnalysisReportRepository;
import com.nguyenquyen.dev.analyticsservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
@Service
public class AnalysisReportService {

    @Autowired
    private AnalysisReportRepository reportRepository;

    @Autowired
    private DataServiceClient dataServiceClient;

    @Autowired
    private ObjectMapper objectMapper;

    public AnalysisReportResponse createReport(CreateReportRequest request) {
        Long userId = UserContextHolder.getCurrentUserId();
        String userEmail = UserContextHolder.getCurrentUserEmail();
        String userName = UserContextHolder.getCurrentUserFullName();

        DatasetInfo dataset = dataServiceClient.getDatasetById(request.getDatasetId());
        if (dataset == null) {
            throw new RuntimeException("Dataset not found");
        }

        String reportId = generateReportId();

        AnalysisReport report = AnalysisReport.builder()
                .reportId(reportId)
                .userId(userId)
                .userEmail(userEmail)
                .userName(userName)
                .reportType(request.getReportType())
                .datasetId(request.getDatasetId())
                .datasetName(dataset.getName())
                .title(request.getTitle())
                .description(request.getDescription())
                .status("PROCESSING")
                .build();

        try {
            report.setParameters(objectMapper.writeValueAsString(request.getParameters()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize parameters");
        }

        report = reportRepository.save(report);

        processReportAsync(report, request.getParameters());

        return mapToResponse(report);
    }

    private void processReportAsync(AnalysisReport report, Map<String, Object> parameters) {
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(2000);

                Map<String, Object> results = generateReportResults(report.getReportType(), parameters);
                List<Map<String, Object>> charts = generateCharts(report.getReportType(), results);
                List<Map<String, Object>> insights = generateInsights(results);

                report.setResults(objectMapper.writeValueAsString(results));
                report.setCharts(objectMapper.writeValueAsString(charts));
                report.setInsights(objectMapper.writeValueAsString(insights));
                report.setStatus("COMPLETED");
                report.setCompletedAt(LocalDateTime.now());

                reportRepository.save(report);
            } catch (Exception e) {
                report.setStatus("FAILED");
                reportRepository.save(report);
            }
        });
    }

    private Map<String, Object> generateReportResults(String reportType, Map<String, Object> parameters) {
        Map<String, Object> results = new HashMap<>();

        switch (reportType) {
            case "BATTERY_HEALTH":
                results.put("averageSOH", 92.5);
                results.put("averageSOC", 78.3);
                results.put("degradationRate", 0.5);
                results.put("cycleCount", 320);
                results.put("temperatureAvg", 25.4);
                break;

            case "CHARGING_PATTERN":
                results.put("totalChargingSessions", 450);
                results.put("averageChargingDuration", 35.2);
                results.put("peakChargingHours", Arrays.asList(18, 19, 20));
                results.put("fastChargingPercentage", 35.0);
                results.put("averagePowerConsumption", 42.5);
                break;

            case "RANGE_ANALYSIS":
                results.put("averageRange", 285.7);
                results.put("maxRange", 340.0);
                results.put("minRange", 230.0);
                results.put("rangeEfficiency", 88.5);
                results.put("seasonalVariation", 12.3);
                break;

            case "ENERGY_CONSUMPTION":
                results.put("totalEnergyConsumed", 12450.5);
                results.put("averageConsumptionPer100km", 18.5);
                results.put("regeneratedEnergy", 2340.8);
                results.put("regenerationEfficiency", 18.8);
                break;

            default:
                results.put("message", "Generic analysis completed");
        }

        results.put("recordCount", 1000);
        results.put("analysisDate", LocalDateTime.now().toString());

        return results;
    }

    private List<Map<String, Object>> generateCharts(String reportType, Map<String, Object> results) {
        List<Map<String, Object>> charts = new ArrayList<>();

        Map<String, Object> chart1 = new HashMap<>();
        chart1.put("type", "line");
        chart1.put("title", "Trend Over Time");
        chart1.put("data", Arrays.asList(
                Map.of("x", "2024-01", "y", 85.5),
                Map.of("x", "2024-02", "y", 87.2),
                Map.of("x", "2024-03", "y", 89.1),
                Map.of("x", "2024-04", "y", 90.3),
                Map.of("x", "2024-05", "y", 92.5)
        ));
        charts.add(chart1);

        Map<String, Object> chart2 = new HashMap<>();
        chart2.put("type", "bar");
        chart2.put("title", "Distribution Analysis");
        chart2.put("data", Arrays.asList(
                Map.of("category", "Excellent", "value", 450),
                Map.of("category", "Good", "value", 320),
                Map.of("category", "Fair", "value", 180),
                Map.of("category", "Poor", "value", 50)
        ));
        charts.add(chart2);

        return charts;
    }

    private List<Map<String, Object>> generateInsights(Map<String, Object> results) {
        List<Map<String, Object>> insights = new ArrayList<>();

        Map<String, Object> insight1 = new HashMap<>();
        insight1.put("type", "positive");
        insight1.put("message", "Battery health is above average for this vehicle age");
        insight1.put("confidence", 0.85);
        insights.add(insight1);

        Map<String, Object> insight2 = new HashMap<>();
        insight2.put("type", "recommendation");
        insight2.put("message", "Consider reducing fast charging frequency to extend battery life");
        insight2.put("confidence", 0.78);
        insights.add(insight2);

        return insights;
    }

    public List<AnalysisReportResponse> getMyReports() {
        Long userId = UserContextHolder.getCurrentUserId();
        return reportRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AnalysisReportResponse getReportById(Long id) {
        AnalysisReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!report.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(report);
    }

    public void deleteReport(Long id) {
        AnalysisReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!report.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        reportRepository.delete(report);
    }

    private String generateReportId() {
        return "REP_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
    }

    private AnalysisReportResponse mapToResponse(AnalysisReport report) {
        try {
            return AnalysisReportResponse.builder()
                    .id(report.getId())
                    .reportId(report.getReportId())
                    .userId(report.getUserId())
                    .userEmail(report.getUserEmail())
                    .userName(report.getUserName())
                    .reportType(report.getReportType())
                    .datasetId(report.getDatasetId())
                    .datasetName(report.getDatasetName())
                    .title(report.getTitle())
                    .description(report.getDescription())
                    .status(report.getStatus())
                    .parameters(report.getParameters() != null ?
                            objectMapper.readValue(report.getParameters(), Map.class) : null)
                    .results(report.getResults() != null ?
                            objectMapper.readValue(report.getResults(), Map.class) : null)
                    .charts(report.getCharts() != null ?
                            objectMapper.readValue(report.getCharts(), List.class) : null)
                    .insights(report.getInsights() != null ?
                            objectMapper.readValue(report.getInsights(), List.class) : null)
                    .createdAt(report.getCreatedAt())
                    .completedAt(report.getCompletedAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to map report to response");
        }
    }
}