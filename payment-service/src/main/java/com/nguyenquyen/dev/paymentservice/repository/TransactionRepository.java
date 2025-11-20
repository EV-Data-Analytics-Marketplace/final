package com.nguyenquyen.dev.paymentservice.repository;

import com.nguyenquyen.dev.paymentservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionId(String transactionId);

    List<Transaction> findByConsumerId(Long consumerId);

    List<Transaction> findByProviderId(Long providerId);

    List<Transaction> findByStatus(String status);

    List<Transaction> findByDatasetId(Long datasetId);

    @Query("SELECT t FROM Transaction t WHERE t.consumerId = :userId OR t.providerId = :userId")
    List<Transaction> findByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.status = :status " +
            "AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByStatusAndDateRange(@Param("status") String status,
                                               @Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = 'COMPLETED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT SUM(t.platformFee) FROM Transaction t WHERE t.status = 'COMPLETED'")
    BigDecimal sumPlatformFees();

    @Query("SELECT SUM(t.providerRevenue) FROM Transaction t " +
            "WHERE t.providerId = :providerId AND t.status = 'COMPLETED'")
    BigDecimal sumProviderRevenue(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'COMPLETED'")
    Long countCompletedTransactions();

    @Query("SELECT t.datasetId, COUNT(t), SUM(t.amount) FROM Transaction t " +
            "WHERE t.status = 'COMPLETED' GROUP BY t.datasetId")
    List<Object[]> getDatasetRevenueStats();

    Boolean existsByTransactionId(String transactionId);
}