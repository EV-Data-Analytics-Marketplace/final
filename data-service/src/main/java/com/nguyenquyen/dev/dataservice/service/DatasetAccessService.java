package com.nguyenquyen.dev.dataservice.service;

import com.nguyenquyen.dev.dataservice.dto.request.DatasetAccessRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DatasetAccessResponse;
import com.nguyenquyen.dev.dataservice.entity.Dataset;
import com.nguyenquyen.dev.dataservice.entity.DatasetAccess;
import com.nguyenquyen.dev.dataservice.repository.DatasetAccessRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRepository;
import com.nguyenquyen.dev.dataservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DatasetAccessService {

    @Autowired
    private DatasetAccessRepository accessRepository;

    @Autowired
    private DatasetRepository datasetRepository;

    public DatasetAccessResponse grantAccess(DatasetAccessRequest request) {
        Dataset dataset = datasetRepository.findById(request.getDatasetId())
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        if (!"PUBLISHED".equals(dataset.getStatus())) {
            throw new RuntimeException("Dataset is not published");
        }

        Long userId = UserContextHolder.getCurrentUserId();
        String userEmail = UserContextHolder.getCurrentUserEmail();
        String userName = UserContextHolder.getCurrentUserFullName();

        // Check if user already has active access
        Optional<DatasetAccess> existingAccess = accessRepository.findActiveAccess(
                userId, request.getDatasetId(), LocalDateTime.now()
        );

        if (existingAccess.isPresent()) {
            throw new RuntimeException("You already have active access to this dataset");
        }

        LocalDateTime expiresAt = null;
        if (request.getDurationDays() != null && request.getDurationDays() > 0) {
            expiresAt = LocalDateTime.now().plusDays(request.getDurationDays());
        }

        Integer apiCallsLimit = request.getApiCallsLimit() != null ?
                request.getApiCallsLimit() : 0;

        DatasetAccess access = DatasetAccess.builder()
                .dataset(dataset)
                .userId(userId)
                .userEmail(userEmail)
                .userName(userName)
                .accessType(request.getAccessType())
                .status("ACTIVE")
                .expiresAt(expiresAt)
                .pricePaid(dataset.getPrice())
                //.transactionId(request.getTransactionId()) // chỉnh sủa
                .apiCallsLimit(apiCallsLimit)
                .apiCallsUsed(0)
                .downloadCount(0)
                .build();

        if ("API".equals(request.getAccessType())) {
            access.setApiAccessToken(generateAccessToken());
        }

        access = accessRepository.save(access);

        // Update dataset statistics
        dataset.setPurchaseCount(dataset.getPurchaseCount() + 1);
        datasetRepository.save(dataset);

        return mapToResponse(access);
    }

    public List<DatasetAccessResponse> getMyAccesses() {
        Long userId = UserContextHolder.getCurrentUserId();

        return accessRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DatasetAccessResponse getAccessById(Long id) {
        DatasetAccess access = accessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Access record not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!access.getUserId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        return mapToResponse(access);
    }

    public void recordDownload(Long datasetId) {
        Dataset dataset = datasetRepository.findById(datasetId)
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        Long userId = UserContextHolder.getCurrentUserId();

        DatasetAccess access = accessRepository.findActiveAccess(
                userId, datasetId, LocalDateTime.now()
        ).orElseThrow(() -> new RuntimeException("No active access to this dataset"));

        access.setDownloadCount(access.getDownloadCount() + 1);
        access.setLastAccessedAt(LocalDateTime.now());
        accessRepository.save(access);

        dataset.setDownloadCount(dataset.getDownloadCount() + 1);
        datasetRepository.save(dataset);
    }

    public void recordApiCall(Long datasetId, String apiToken) {
        DatasetAccess access = accessRepository.findByUserId(UserContextHolder.getCurrentUserId())
                .stream()
                .filter(a -> a.getDataset().getId().equals(datasetId) &&
                        apiToken.equals(a.getApiAccessToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid API token"));

        if (access.getApiCallsUsed() >= access.getApiCallsLimit()) {
            throw new RuntimeException("API call limit exceeded");
        }

        access.setApiCallsUsed(access.getApiCallsUsed() + 1);
        access.setLastAccessedAt(LocalDateTime.now());
        accessRepository.save(access);
    }

    public void revokeAccess(Long id) {
        DatasetAccess access = accessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Access record not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        Long providerId = access.getDataset().getProviderId();

        if (!access.getUserId().equals(currentUserId) &&
                !providerId.equals(currentUserId) &&
                !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        access.setStatus("REVOKED");
        accessRepository.save(access);
    }

    private String generateAccessToken() {
        return "evdt_" + UUID.randomUUID().toString().replace("-", "");
    }

    private DatasetAccessResponse mapToResponse(DatasetAccess access) {
        return DatasetAccessResponse.builder()
                .id(access.getId())
                .datasetId(access.getDataset().getId())
                .datasetName(access.getDataset().getName())
                .userId(access.getUserId())
                .userEmail(access.getUserEmail())
                .userName(access.getUserName())
                .accessType(access.getAccessType())
                .status(access.getStatus())
                .expiresAt(access.getExpiresAt())
                .pricePaid(access.getPricePaid())
                .transactionId(access.getTransactionId())
                .apiAccessToken(access.getApiAccessToken())
                .apiCallsLimit(access.getApiCallsLimit())
                .apiCallsUsed(access.getApiCallsUsed())
                .downloadCount(access.getDownloadCount())
                .lastAccessedAt(access.getLastAccessedAt())
                .grantedAt(access.getGrantedAt())
                .build();
    }
}
