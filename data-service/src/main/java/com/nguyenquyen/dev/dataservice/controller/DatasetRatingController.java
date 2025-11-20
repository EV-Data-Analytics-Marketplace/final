package com.nguyenquyen.dev.dataservice.controller;

import com.nguyenquyen.dev.dataservice.dto.request.DatasetRatingRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DatasetRatingResponse;
import com.nguyenquyen.dev.dataservice.service.DatasetRatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class DatasetRatingController {

    @Autowired
    private DatasetRatingService ratingService;

    @PostMapping
    public ResponseEntity<?> rateDataset(@Valid @RequestBody DatasetRatingRequest request) {
        try {
            DatasetRatingResponse rating = ratingService.rateDataset(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(rating);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to rate dataset", "error", e.getMessage()));
        }
    }

    @GetMapping("/dataset/{datasetId}")
    public ResponseEntity<?> getDatasetRatings(@PathVariable Long datasetId) {
        try {
            List<DatasetRatingResponse> ratings = ratingService.getDatasetRatings(datasetId);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch ratings", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-ratings")
    public ResponseEntity<?> getMyRatings() {
        try {
            List<DatasetRatingResponse> ratings = ratingService.getMyRatings();
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch ratings", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRating(@PathVariable Long id) {
        try {
            ratingService.deleteRating(id);
            return ResponseEntity.ok(Map.of("message", "Rating deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to delete rating", "error", e.getMessage()));
        }
    }
}