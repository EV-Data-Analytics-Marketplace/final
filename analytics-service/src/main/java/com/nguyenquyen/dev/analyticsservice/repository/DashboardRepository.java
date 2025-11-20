package com.nguyenquyen.dev.analyticsservice.repository;


import com.nguyenquyen.dev.analyticsservice.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {

    Optional<Dashboard> findByDashboardId(String dashboardId);

    List<Dashboard> findByUserId(Long userId);

    List<Dashboard> findByDashboardType(String dashboardType);

    List<Dashboard> findByIsPublic(Boolean isPublic);

    List<Dashboard> findByIsTemplate(Boolean isTemplate);

    @Query("SELECT d FROM Dashboard d WHERE d.isPublic = true OR d.userId = :userId")
    List<Dashboard> findAccessibleDashboards(@Param("userId") Long userId);

    Boolean existsByDashboardId(String dashboardId);
}
