package com.nguyenquyen.dev.dataservice.service;

import com.nguyenquyen.dev.dataservice.dto.request.DataCategoryRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DataCategoryResponse;
import com.nguyenquyen.dev.dataservice.entity.DataCategory;
import com.nguyenquyen.dev.dataservice.repository.DataCategoryRepository;
import com.nguyenquyen.dev.dataservice.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataCategoryService {

    @Autowired
    private DataCategoryRepository categoryRepository;

    @Autowired
    private DatasetRepository datasetRepository;

    public DataCategoryResponse createCategory(DataCategoryRequest request) {
        if (categoryRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Category code already exists");
        }

        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists");
        }

        DataCategory category = DataCategory.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .iconUrl(request.getIconUrl())
                .type(request.getType())
                .active(request.getActive())
                .displayOrder(request.getDisplayOrder())
                .build();

        category = categoryRepository.save(category);

        return mapToResponse(category);
    }

    public DataCategoryResponse updateCategory(Long id, DataCategoryRequest request) {
        DataCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getCode().equals(request.getCode()) &&
                categoryRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Category code already exists");
        }

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists");
        }

        category.setName(request.getName());
        category.setCode(request.getCode());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());
        category.setType(request.getType());
        category.setActive(request.getActive());
        category.setDisplayOrder(request.getDisplayOrder());

        category = categoryRepository.save(category);

        return mapToResponse(category);
    }

    public List<DataCategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DataCategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveOrderByDisplayOrderAsc(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DataCategoryResponse getCategoryById(Long id) {
        DataCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapToResponse(category);
    }

    public DataCategoryResponse getCategoryByCode(String code) {
        DataCategory category = categoryRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return mapToResponse(category);
    }

    public void deleteCategory(Long id) {
        DataCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        long datasetCount = datasetRepository.findByCategoryId(id).size();
        if (datasetCount > 0) {
            throw new RuntimeException("Cannot delete category with existing datasets");
        }

        categoryRepository.delete(category);
    }

    private DataCategoryResponse mapToResponse(DataCategory category) {
        int datasetCount = category.getDatasets() != null ? category.getDatasets().size() : 0;

        return DataCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .code(category.getCode())
                .description(category.getDescription())
                .iconUrl(category.getIconUrl())
                .type(category.getType())
                .active(category.getActive())
                .displayOrder(category.getDisplayOrder())
                .datasetCount(datasetCount)
                .createdAt(category.getCreatedAt())
                .build();
    }
}