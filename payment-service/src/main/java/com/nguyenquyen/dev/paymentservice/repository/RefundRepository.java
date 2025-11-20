package com.nguyenquyen.dev.paymentservice.repository;

import com.nguyenquyen.dev.paymentservice.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface RefundRepository extends JpaRepository<Refund, Long> {

    Optional<Refund> findByRefundId(String refundId);

    List<Refund> findByTransactionId(Long transactionId);

    List<Refund> findByStatus(String status);

    List<Refund> findByRequestedBy(Long userId);

    @Query("SELECT r FROM Refund r WHERE r.status = :status " +
            "AND r.createdAt BETWEEN :startDate AND :endDate")
    List<Refund> findByStatusAndDateRange(@Param("status") String status,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    Boolean existsByRefundId(String refundId);
}