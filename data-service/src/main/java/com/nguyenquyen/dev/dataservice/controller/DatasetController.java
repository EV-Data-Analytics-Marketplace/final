package com.nguyenquyen.dev.dataservice.controller;

import com.nguyenquyen.dev.dataservice.dto.request.DatasetRequest;
import com.nguyenquyen.dev.dataservice.dto.request.DatasetSearchRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DatasetResponse;
import com.nguyenquyen.dev.dataservice.dto.response.PageResponse;
import com.nguyenquyen.dev.dataservice.service.DatasetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/datasets")
public class DatasetController {

    @Autowired
    private DatasetService datasetService;

    @PostMapping("/search")
    public ResponseEntity<?> searchDatasets(@RequestBody DatasetSearchRequest searchRequest) {
        try {
            PageResponse<DatasetResponse> result = datasetService.searchDatasets(searchRequest);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Search failed", "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDatasetById(@PathVariable Long id) {
        try {
            DatasetResponse dataset = datasetService.getDatasetById(id);
            return ResponseEntity.ok(dataset);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Dataset not found", "error", e.getMessage()));
        }
    }

    @GetMapping("/public/{id}/view")
    public ResponseEntity<?> viewDatasetPublic(@PathVariable Long id) {
        try {
            DatasetResponse dataset = datasetService.getDatasetById(id);
            return ResponseEntity.ok(dataset);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Dataset not found", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-datasets")
    public ResponseEntity<?> getMyDatasets() {
        try {
            List<DatasetResponse> datasets = datasetService.getMyDatasets();
            return ResponseEntity.ok(datasets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch datasets", "error", e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('DATA_PROVIDER')")
    public ResponseEntity<?> createDataset(@Valid @RequestBody DatasetRequest request) {
        try {
            DatasetResponse dataset = datasetService.createDataset(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(dataset);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to create dataset", "error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDataset(@PathVariable Long id,
                                           @Valid @RequestBody DatasetRequest request) {
        try {
            DatasetResponse dataset = datasetService.updateDataset(id, request);
            return ResponseEntity.ok(dataset);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to update dataset", "error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<?> publishDataset(@PathVariable Long id) {
        try {
            DatasetResponse dataset = datasetService.publishDataset(id);
            return ResponseEntity.ok(dataset);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to publish dataset", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDataset(@PathVariable Long id) {
        try {
            datasetService.deleteDataset(id);
            return ResponseEntity.ok(Map.of("message", "Dataset deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to delete dataset", "error", e.getMessage()));
        }
    }
}