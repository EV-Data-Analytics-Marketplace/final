package com.nguyenquyen.dev.analyticsservice.controller;

import com.nguyenquyen.dev.analyticsservice.dto.request.PredictionRequest;
import com.nguyenquyen.dev.analyticsservice.dto.response.PredictionResponse;
import com.nguyenquyen.dev.analyticsservice.repository.*;
import com.nguyenquyen.dev.analyticsservice.service.AIPredictionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    @Autowired
    private AIPredictionService predictionService;

    @PostMapping
    public ResponseEntity<?> createPrediction(@Valid @RequestBody PredictionRequest request) {
        try {
            PredictionResponse response = predictionService.createPrediction(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to create prediction", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-predictions")
    public ResponseEntity<?> getMyPredictions() {
        try {
            List<PredictionResponse> predictions = predictionService.getMyPredictions();
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch predictions", "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPredictionById(@PathVariable Long id) {
        try {
            PredictionResponse prediction = predictionService.getPredictionById(id);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Prediction not found", "error", e.getMessage()));
        }
    }
}