package com.nguyenquyen.dev.dataservice.service;

import com.nguyenquyen.dev.dataservice.dto.request.DatasetRatingRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DatasetRatingResponse;
import com.nguyenquyen.dev.dataservice.entity.Dataset;
import com.nguyenquyen.dev.dataservice.entity.DatasetRating;
import com.nguyenquyen.dev.dataservice.repository.DatasetAccessRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRatingRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRepository;
import com.nguyenquyen.dev.dataservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DatasetRatingService {

    @Autowired
    private DatasetRatingRepository ratingRepository;

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DatasetAccessRepository accessRepository;

    public DatasetRatingResponse rateDataset(DatasetRatingRequest request) {
        Dataset dataset = datasetRepository.findById(request.getDatasetId())
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        Long userId = UserContextHolder.getCurrentUserId();
        String userEmail = UserContextHolder.getCurrentUserEmail();
        String userName = UserContextHolder.getCurrentUserFullName();

        // Check if user has access to the dataset
        boolean hasAccess = accessRepository.existsByUserIdAndDatasetId(userId, request.getDatasetId());
        if (!hasAccess) {
            throw new RuntimeException("You must have access to the dataset to rate it");
        }

        // Check if user already rated
        Optional<DatasetRating> existingRating = ratingRepository.findByDatasetIdAndUserId(
                request.getDatasetId(), userId
        );

        DatasetRating rating;

        if (existingRating.isPresent()) {
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
        } else {
            rating = DatasetRating.builder()
                    .dataset(dataset)
                    .userId(userId)
                    .userEmail(userEmail)
                    .userName(userName)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .build();
        }

        rating = ratingRepository.save(rating);

        // Update dataset rating
        updateDatasetRating(dataset);

        return mapToResponse(rating);
    }

    public List<DatasetRatingResponse> getDatasetRatings(Long datasetId) {
        return ratingRepository.findByDatasetId(datasetId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DatasetRatingResponse> getMyRatings() {
        Long userId = UserContextHolder.getCurrentUserId();

        return ratingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteRating(Long id) {
        DatasetRating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!rating.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        Dataset dataset = rating.getDataset();

        ratingRepository.delete(rating);

        // Update dataset rating
        updateDatasetRating(dataset);
    }

    private void updateDatasetRating(Dataset dataset) {
        Double avgRating = ratingRepository.calculateAverageRating(dataset.getId());
        Long ratingCount = ratingRepository.countRatings(dataset.getId());

        dataset.setRating(avgRating != null ? avgRating : 0.0);
        dataset.setRatingCount(ratingCount.intValue());

        datasetRepository.save(dataset);
    }

    private DatasetRatingResponse mapToResponse(DatasetRating rating) {
        return DatasetRatingResponse.builder()
                .id(rating.getId())
                .datasetId(rating.getDataset().getId())
                .userId(rating.getUserId())
                .userEmail(rating.getUserEmail())
                .userName(rating.getUserName())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}