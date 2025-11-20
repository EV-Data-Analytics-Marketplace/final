package com.nguyenquyen.dev.analyticsservice.controller;

import com.nguyenquyen.dev.analyticsservice.dto.response.DataQualityResponse;
import com.nguyenquyen.dev.analyticsservice.service.DataQualityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

public class DataQualityController {

    @Autowired
    private DataQualityService qualityService;

    @PostMapping("/assess/{datasetId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DATA_PROVIDER')")
    public ResponseEntity<?> assessDataQuality(@PathVariable Long datasetId,
                                               @RequestBody Map<String, Object> datasetMetrics) {
        try {
            DataQualityResponse response = qualityService.assessDataQuality(datasetId, datasetMetrics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to assess data quality", "error", e.getMessage()));
        }
    }

    @GetMapping("/dataset/{datasetId}/latest")
    public ResponseEntity<?> getLatestQuality(@PathVariable Long datasetId) {
        try {
            DataQualityResponse quality = qualityService.getLatestQuality(datasetId);
            return ResponseEntity.ok(quality);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No quality assessment found", "error", e.getMessage()));
        }
    }

    @GetMapping("/low-quality")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getLowQualityDatasets(@RequestParam(defaultValue = "70.0") Double threshold) {
        try {
            List<DataQualityResponse> datasets = qualityService.getLowQualityDatasets(threshold);
            return ResponseEntity.ok(Map.of(
                    "threshold", threshold,
                    "count", datasets.size(),
                    "datasets", datasets
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch low quality datasets", "error", e.getMessage()));
        }
    }
}