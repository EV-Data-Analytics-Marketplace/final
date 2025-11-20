package com.nguyenquyen.dev.paymentservice.repository;

import com.nguyenquyen.dev.paymentservice.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {

    List<PaymentMethod> findByUserId(Long userId);

    List<PaymentMethod> findByUserIdAndIsActive(Long userId, Boolean isActive);

    Optional<PaymentMethod> findByUserIdAndIsDefault(Long userId, Boolean isDefault);

    @Query("SELECT pm FROM PaymentMethod pm WHERE pm.userId = :userId " +
            "AND pm.type = :type AND pm.isActive = true")
    List<PaymentMethod> findActiveByUserIdAndType(@Param("userId") Long userId,
                                                  @Param("type") String type);

    Boolean existsByUserIdAndPaymentGatewayId(Long userId, String paymentGatewayId);
}