package com.nguyenquyen.dev.dataservice.repository;

import com.nguyenquyen.dev.dataservice.entity.DataCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DataCategoryRepository extends JpaRepository<DataCategory, Long> {

    Optional<DataCategory> findByCode(String code);

    Optional<DataCategory> findByName(String name);

    List<DataCategory> findByActiveOrderByDisplayOrderAsc(Boolean active);

    List<DataCategory> findByType(String type);

    Boolean existsByCode(String code);

    Boolean existsByName(String name);
}
