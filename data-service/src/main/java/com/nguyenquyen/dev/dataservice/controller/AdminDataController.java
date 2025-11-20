package com.nguyenquyen.dev.dataservice.controller;

import com.nguyenquyen.dev.dataservice.dto.response.DatasetStatsResponse;
import com.nguyenquyen.dev.dataservice.entity.Dataset;
import com.nguyenquyen.dev.dataservice.entity.DatasetAccess;
import com.nguyenquyen.dev.dataservice.repository.DataCategoryRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetAccessRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminDataController {

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DatasetAccessRepository accessRepository;

    @Autowired
    private DataCategoryRepository categoryRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDatasetStats() {
        try {
            Long totalDatasets = datasetRepository.count();
            Long publishedDatasets = datasetRepository.countPublishedDatasets();
            Long totalDownloads = datasetRepository.sumTotalDownloads();
            Long totalPurchases = datasetRepository.sumTotalPurchases();
            Double averageRating = datasetRepository.calculateAverageRating();
            Long totalConsumers = accessRepository.countTotalConsumers();

            // Count unique providers
            Long totalProviders = datasetRepository.findAll().stream()
                    .map(Dataset::getProviderId)
                    .distinct()
                    .count();

            // Datasets by category
            Map<String, Long> datasetsByCategory = new HashMap<>();
            categoryRepository.findAll().forEach(category -> {
                long count = datasetRepository.findByCategoryId(category.getId()).size();
                datasetsByCategory.put(category.getName(), count);
            });

            // Datasets by type
            Map<String, Long> datasetsByType = datasetRepository.findAll().stream()
                    .collect(Collectors.groupingBy(Dataset::getDataType, Collectors.counting()));

            DatasetStatsResponse stats = DatasetStatsResponse.builder()
                    .totalDatasets(totalDatasets)
                    .publishedDatasets(publishedDatasets)
                    .totalDownloads(totalDownloads != null ? totalDownloads : 0L)
                    .totalPurchases(totalPurchases != null ? totalPurchases : 0L)
                    .totalRevenue(BigDecimal.ZERO) // Will be calculated from payment service
                    .averageRating(averageRating != null ? averageRating : 0.0)
                    .totalProviders(totalProviders)
                    .totalConsumers(totalConsumers)
                    .datasetsByCategory(datasetsByCategory)
                    .datasetsByType(datasetsByType)
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch stats", "error", e.getMessage()));
        }
    }

    @GetMapping("/datasets")
    public ResponseEntity<?> getAllDatasets(@RequestParam(required = false) String status) {
        try {
            List<Dataset> datasets;

            if (status != null && !status.isEmpty()) {
                datasets = datasetRepository.findByStatus(status);
            } else {
                datasets = datasetRepository.findAll();
            }

            List<Map<String, Object>> response = datasets.stream()
                    .map(d -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", d.getId());
                        map.put("name", d.getName());
                        map.put("code", d.getCode());
                        map.put("status", d.getStatus());
                        map.put("providerName", d.getProviderName());
                        map.put("category", d.getCategory().getName());
                        map.put("price", d.getPrice());
                        map.put("downloadCount", d.getDownloadCount());
                        map.put("rating", d.getRating());
                        map.put("createdAt", d.getCreatedAt());
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "total", response.size(),
                    "datasets", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch datasets", "error", e.getMessage()));
        }
    }

    @PatchMapping("/datasets/{id}/status")
    public ResponseEntity<?> updateDatasetStatus(@PathVariable Long id,
                                                 @RequestParam String status) {
        try {
            Dataset dataset = datasetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Dataset not found"));

            dataset.setStatus(status);

            if ("PUBLISHED".equals(status) && dataset.getPublishedAt() == null) {
                dataset.setPublishedAt(LocalDateTime.now());
            }

            datasetRepository.save(dataset);

            return ResponseEntity.ok(Map.of(
                    "message", "Dataset status updated successfully",
                    "datasetId", id,
                    "status", status
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to update status", "error", e.getMessage()));
        }
    }

    @GetMapping("/accesses")
    public ResponseEntity<?> getAllAccesses() {
        try {
            List<DatasetAccess> accesses = accessRepository.findAll();

            List<Map<String, Object>> response = accesses.stream()
                    .map(a -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", a.getId());
                        map.put("datasetName", a.getDataset().getName());
                        map.put("userName", a.getUserName());
                        map.put("userEmail", a.getUserEmail());
                        map.put("accessType", a.getAccessType());
                        map.put("status", a.getStatus());
                        map.put("pricePaid", a.getPricePaid());
                        map.put("grantedAt", a.getGrantedAt());
                        return map;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "total", response.size(),
                    "accesses", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch accesses", "error", e.getMessage()));
        }
    }

    @GetMapping("/providers")
    public ResponseEntity<?> getProvidersStats() {
        try {
            Map<Long, Map<String, Object>> providerStats = new HashMap<>();

            datasetRepository.findAll().forEach(dataset -> {
                Long providerId = dataset.getProviderId();

                providerStats.putIfAbsent(providerId, new HashMap<>());
                Map<String, Object> stats = providerStats.get(providerId);

                stats.put("providerId", providerId);
                stats.put("providerName", dataset.getProviderName());
                stats.put("datasetCount", (Integer) stats.getOrDefault("datasetCount", 0) + 1);
                stats.put("totalDownloads",
                        (Integer) stats.getOrDefault("totalDownloads", 0) + dataset.getDownloadCount());
                stats.put("totalPurchases",
                        (Integer) stats.getOrDefault("totalPurchases", 0) + dataset.getPurchaseCount());
            });

            return ResponseEntity.ok(Map.of(
                    "total", providerStats.size(),
                    "providers", providerStats.values()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch provider stats", "error", e.getMessage()));
        }
    }
}