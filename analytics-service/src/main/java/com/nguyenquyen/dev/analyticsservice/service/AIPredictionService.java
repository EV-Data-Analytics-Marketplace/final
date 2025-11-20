package com.nguyenquyen.dev.analyticsservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nguyenquyen.dev.analyticsservice.dto.request.PredictionRequest;
import com.nguyenquyen.dev.analyticsservice.dto.response.PredictionResponse;
import com.nguyenquyen.dev.analyticsservice.entity.AIPrediction;
import com.nguyenquyen.dev.analyticsservice.repository.AIPredictionRepository;
import com.nguyenquyen.dev.analyticsservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class AIPredictionService {

    @Autowired
    private AIPredictionRepository predictionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public PredictionResponse createPrediction(PredictionRequest request) {
        Long userId = UserContextHolder.getCurrentUserId();

        String predictionId = generatePredictionId();
        String modelName = getModelName(request.getPredictionType());
        String modelVersion = request.getModelVersion() != null ?
                request.getModelVersion() : "v1.0";

        AIPrediction prediction = AIPrediction.builder()
                .predictionId(predictionId)
                .userId(userId)
                .datasetId(request.getDatasetId())
                .predictionType(request.getPredictionType())
                .modelName(modelName)
                .modelVersion(modelVersion)
                .status("PROCESSING")
                .build();

        try {
            prediction.setInputData(objectMapper.writeValueAsString(request.getInputData()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize input data");
        }

        prediction = predictionRepository.save(prediction);

        processPredictionAsync(prediction, request.getInputData());

        return mapToResponse(prediction);
    }

    private void processPredictionAsync(AIPrediction prediction, Map<String, Object> inputData) {
        CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(1500);

                Map<String, Object> result = generatePrediction(
                        prediction.getPredictionType(), inputData);
                double confidence = calculateConfidence(result);

                prediction.setPredictionResult(objectMapper.writeValueAsString(result));
                prediction.setConfidenceScore(confidence);
                prediction.setStatus("COMPLETED");
                prediction.setCompletedAt(LocalDateTime.now());

                predictionRepository.save(prediction);
            } catch (Exception e) {
                prediction.setStatus("FAILED");
                prediction.setErrorMessage(e.getMessage());
                predictionRepository.save(prediction);
            }
        });
    }

    private Map<String, Object> generatePrediction(String predictionType, Map<String, Object> inputData) {
        Map<String, Object> result = new HashMap<>();

        switch (predictionType) {
            case "BATTERY_DEGRADATION":
                result.put("predictedSOH", 85.3);
                result.put("estimatedLifespan", 8.5);
                result.put("degradationRate", 1.2);
                result.put("recommendedActions", Arrays.asList(
                        "Reduce fast charging frequency",
                        "Maintain optimal temperature range",
                        "Avoid deep discharge cycles"
                ));
                break;

            case "CHARGING_DEMAND":
                result.put("peakDemandTime", "18:00-20:00");
                result.put("estimatedDailyDemand", 450.5);
                result.put("weeklyTrend", "increasing");
                result.put("requiredCapacity", 120.0);
                break;

            case "RANGE_PREDICTION":
                result.put("estimatedRange", 285.7);
                result.put("optimisticRange", 310.2);
                result.put("conservativeRange", 265.3);
                result.put("factorsConsidered", Arrays.asList(
                        "Weather conditions",
                        "Driving patterns",
                        "Battery condition",
                        "Terrain"
                ));
                break;

            case "MAINTENANCE_PREDICTION":
                result.put("nextMaintenanceDate", "2024-12-15");
                result.put("urgency", "medium");
                result.put("estimatedCost", 450.0);
                result.put("components", Arrays.asList("Brake pads", "Coolant", "Software update"));
                break;

            default:
                result.put("message", "Generic prediction completed");
        }

        result.put("modelVersion", "v1.0");
        result.put("predictionDate", LocalDateTime.now().toString());

        return result;
    }

    private double calculateConfidence(Map<String, Object> result) {
        return 0.75 + (Math.random() * 0.2);
    }

    public List<PredictionResponse> getMyPredictions() {
        Long userId = UserContextHolder.getCurrentUserId();
        return predictionRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PredictionResponse getPredictionById(Long id) {
        AIPrediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!prediction.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(prediction);
    }

    private String getModelName(String predictionType) {
        Map<String, String> modelMap = Map.of(
                "BATTERY_DEGRADATION", "Battery Health Predictor",
                "CHARGING_DEMAND", "Charging Demand Forecaster",
                "RANGE_PREDICTION", "Range Estimator",
                "MAINTENANCE_PREDICTION", "Maintenance Scheduler"
        );
        return modelMap.getOrDefault(predictionType, "Generic AI Model");
    }

    private String generatePredictionId() {
        return "PRD_" + UUID.randomUUID().toString().replace("-", "").substring(0, 20).toUpperCase();
    }

    private PredictionResponse mapToResponse(AIPrediction prediction) {
        try {
            return PredictionResponse.builder()
                    .id(prediction.getId())
                    .predictionId(prediction.getPredictionId())
                    .userId(prediction.getUserId())
                    .datasetId(prediction.getDatasetId())
                    .predictionType(prediction.getPredictionType())
                    .modelName(prediction.getModelName())
                    .modelVersion(prediction.getModelVersion())
                    .inputData(prediction.getInputData() != null ?
                            objectMapper.readValue(prediction.getInputData(), Map.class) : null)
                    .predictionResult(prediction.getPredictionResult() != null ?
                            objectMapper.readValue(prediction.getPredictionResult(), Map.class) : null)
                    .confidenceScore(prediction.getConfidenceScore())
                    .status(prediction.getStatus())
                    .errorMessage(prediction.getErrorMessage())
                    .createdAt(prediction.getCreatedAt())
                    .completedAt(prediction.getCompletedAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to map prediction to response");
        }
    }
}