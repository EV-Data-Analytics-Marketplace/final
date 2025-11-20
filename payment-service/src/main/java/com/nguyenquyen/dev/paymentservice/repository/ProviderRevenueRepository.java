package com.nguyenquyen.dev.paymentservice.repository;

import com.nguyenquyen.dev.paymentservice.entity.ProviderRevenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
public interface ProviderRevenueRepository extends JpaRepository<ProviderRevenue, Long> {

    Optional<ProviderRevenue> findByProviderIdAndYearAndMonth(Long providerId, Integer year, Integer month);

    List<ProviderRevenue> findByProviderId(Long providerId);

    List<ProviderRevenue> findByYearAndMonth(Integer year, Integer month);

    List<ProviderRevenue> findByPaymentStatus(String paymentStatus);

    @Query("SELECT pr FROM ProviderRevenue pr WHERE pr.providerId = :providerId " +
            "AND pr.year = :year ORDER BY pr.month DESC")
    List<ProviderRevenue> findByProviderIdAndYear(@Param("providerId") Long providerId,
                                                  @Param("year") Integer year);

    @Query("SELECT SUM(pr.totalRevenue) FROM ProviderRevenue pr " +
            "WHERE pr.providerId = :providerId AND pr.paymentStatus = 'PAID'")
    BigDecimal sumPaidRevenue(@Param("providerId") Long providerId);
}