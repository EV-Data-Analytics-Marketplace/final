package com.nguyenquyen.dev.dataservice.service;

import com.nguyenquyen.dev.dataservice.dto.request.DatasetRequest;
import com.nguyenquyen.dev.dataservice.dto.request.DatasetSearchRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DatasetResponse;
import com.nguyenquyen.dev.dataservice.dto.response.PageResponse;
import com.nguyenquyen.dev.dataservice.entity.DataCategory;
import com.nguyenquyen.dev.dataservice.entity.Dataset;
import com.nguyenquyen.dev.dataservice.repository.DataCategoryRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetAccessRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRatingRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRepository;
import com.nguyenquyen.dev.dataservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DatasetService {

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private DataCategoryRepository categoryRepository;

    @Autowired
    private DatasetAccessRepository accessRepository;

    @Autowired
    private DatasetRatingRepository ratingRepository;

    public DatasetResponse createDataset(DatasetRequest request) {
        if (datasetRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Dataset code already exists");
        }

        DataCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Long providerId = UserContextHolder.getCurrentUserId();
        String providerEmail = UserContextHolder.getCurrentUserEmail();
        String providerName = UserContextHolder.getCurrentUserFullName();

        Dataset dataset = Dataset.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .category(category)
                .providerId(providerId)
                .providerName(providerName)
                .dataType(request.getDataType())
                .format(request.getFormat())
                .status("DRAFT")
                .pricingModel(request.getPricingModel())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .usageRights(request.getUsageRights())
                .region(request.getRegion())
                .country(request.getCountry())
                .city(request.getCity())
                .dataStartDate(request.getDataStartDate())
                .dataEndDate(request.getDataEndDate())
                .fileUrl(request.getFileUrl())
                .fileSize(request.getFileSize())
                .recordCount(request.getRecordCount())
                .apiEndpoint(request.getApiEndpoint())
                .tags(request.getTags())
                .sampleData(request.getSampleData())
                .datasetSchema(request.getSchema())
                .anonymized(request.getAnonymized())
                .gdprCompliant(request.getGdprCompliant())
                .build();

        if (dataset.getApiEndpoint() != null) {
            dataset.setApiKey(generateApiKey());
        }

        dataset = datasetRepository.save(dataset);

        return mapToResponse(dataset, false);
    }

    public DatasetResponse updateDataset(Long id, DatasetRequest request) {
        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!dataset.getProviderId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        if (!dataset.getCode().equals(request.getCode()) &&
                datasetRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Dataset code already exists");
        }

        DataCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        dataset.setName(request.getName());
        dataset.setCode(request.getCode());
        dataset.setDescription(request.getDescription());
        dataset.setCategory(category);
        dataset.setDataType(request.getDataType());
        dataset.setFormat(request.getFormat());
        dataset.setPricingModel(request.getPricingModel());
        dataset.setPrice(request.getPrice());
        dataset.setCurrency(request.getCurrency());
        dataset.setUsageRights(request.getUsageRights());
        dataset.setRegion(request.getRegion());
        dataset.setCountry(request.getCountry());
        dataset.setCity(request.getCity());
        dataset.setDataStartDate(request.getDataStartDate());
        dataset.setDataEndDate(request.getDataEndDate());
        dataset.setFileUrl(request.getFileUrl());
        dataset.setFileSize(request.getFileSize());
        dataset.setRecordCount(request.getRecordCount());
        dataset.setApiEndpoint(request.getApiEndpoint());
        dataset.setTags(request.getTags());
        dataset.setSampleData(request.getSampleData());
        dataset.setDatasetSchema(request.getSchema());
        dataset.setAnonymized(request.getAnonymized());
        dataset.setGdprCompliant(request.getGdprCompliant());

        dataset = datasetRepository.save(dataset);

        return mapToResponse(dataset, checkUserAccess(dataset.getId()));
    }

    public DatasetResponse publishDataset(Long id) {
        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!dataset.getProviderId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        dataset.setStatus("PUBLISHED");
        dataset.setPublishedAt(LocalDateTime.now());
        dataset = datasetRepository.save(dataset);

        return mapToResponse(dataset, checkUserAccess(dataset.getId()));
    }

    public PageResponse<DatasetResponse> searchDatasets(DatasetSearchRequest searchRequest) {
        Pageable pageable = PageRequest.of(
                searchRequest.getPage(),
                searchRequest.getSize(),
                Sort.by(Sort.Direction.fromString(searchRequest.getSortDirection()),
                        searchRequest.getSortBy())
        );

        Page<Dataset> page;

        if (searchRequest.getCategoryId() != null ||
                searchRequest.getDataType() != null ||
                searchRequest.getFormat() != null ||
                searchRequest.getPricingModel() != null ||
                searchRequest.getRegion() != null ||
                searchRequest.getCountry() != null ||
                searchRequest.getUsageRights() != null ||
                searchRequest.getMinPrice() != null ||
                searchRequest.getMaxPrice() != null) {

            page = datasetRepository.advancedSearch(
                    "PUBLISHED",
                    searchRequest.getCategoryId(),
                    searchRequest.getDataType(),
                    searchRequest.getFormat(),
                    searchRequest.getPricingModel(),
                    searchRequest.getRegion(),
                    searchRequest.getCountry(),
                    searchRequest.getUsageRights(),
                    searchRequest.getMinPrice(),
                    searchRequest.getMaxPrice(),
                    pageable
            );
        } else {
            page = datasetRepository.searchDatasets(
                    "PUBLISHED",
                    searchRequest.getKeyword(),
                    pageable
            );
        }

        List<DatasetResponse> content = page.getContent().stream()
                .map(dataset -> mapToResponse(dataset, checkUserAccess(dataset.getId())))
                .collect(Collectors.toList());

        return PageResponse.<DatasetResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .first(page.isFirst())
                .build();
    }

    public DatasetResponse getDatasetById(Long id) {
        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        dataset.setViewCount(dataset.getViewCount() + 1);
        datasetRepository.save(dataset);

        return mapToResponse(dataset, checkUserAccess(id));
    }

    public List<DatasetResponse> getMyDatasets() {
        Long providerId = UserContextHolder.getCurrentUserId();

        return datasetRepository.findByProviderId(providerId).stream()
                .map(dataset -> mapToResponse(dataset, true))
                .collect(Collectors.toList());
    }

    public void deleteDataset(Long id) {
        Dataset dataset = datasetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dataset not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!dataset.getProviderId().equals(currentUserId) && !UserContextHolder.isAdmin()) {
            throw new RuntimeException("Access denied");
        }

        datasetRepository.delete(dataset);
    }

    private boolean checkUserAccess(Long datasetId) {
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) {
            return false;
        }

        return accessRepository.findActiveAccess(userId, datasetId, LocalDateTime.now())
                .isPresent();
    }

    private String generateApiKey() {
        return "evdata_" + UUID.randomUUID().toString().replace("-", "");
    }

    private DatasetResponse mapToResponse(Dataset dataset, boolean hasAccess) {
        return DatasetResponse.builder()
                .id(dataset.getId())
                .name(dataset.getName())
                .code(dataset.getCode())
                .description(dataset.getDescription())
                .categoryId(dataset.getCategory().getId())
                .categoryName(dataset.getCategory().getName())
                .providerId(dataset.getProviderId())
                .providerName(dataset.getProviderName())
                .dataType(dataset.getDataType())
                .format(dataset.getFormat())
                .status(dataset.getStatus())
                .pricingModel(dataset.getPricingModel())
                .price(dataset.getPrice())
                .currency(dataset.getCurrency())
                .usageRights(dataset.getUsageRights())
                .region(dataset.getRegion())
                .country(dataset.getCountry())
                .city(dataset.getCity())
                .dataStartDate(dataset.getDataStartDate())
                .dataEndDate(dataset.getDataEndDate())
                .fileUrl(hasAccess ? dataset.getFileUrl() : null)
                .fileSize(dataset.getFileSize())
                .recordCount(dataset.getRecordCount())
                .apiEndpoint(hasAccess ? dataset.getApiEndpoint() : null)
                .tags(dataset.getTags())
                .sampleData(dataset.getSampleData())
                .downloadCount(dataset.getDownloadCount())
                .viewCount(dataset.getViewCount())
                .purchaseCount(dataset.getPurchaseCount())
                .rating(dataset.getRating())
                .ratingCount(dataset.getRatingCount())
                .anonymized(dataset.getAnonymized())
                .gdprCompliant(dataset.getGdprCompliant())
                .createdAt(dataset.getCreatedAt())
                .publishedAt(dataset.getPublishedAt())
                .hasAccess(hasAccess)
                .build();
    }
}