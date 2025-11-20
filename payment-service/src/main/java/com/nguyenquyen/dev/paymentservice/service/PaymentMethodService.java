package com.nguyenquyen.dev.paymentservice.service;

import com.nguyenquyen.dev.paymentservice.dto.request.PaymentMethodRequest;
import com.nguyenquyen.dev.paymentservice.dto.response.PaymentMethodResponse;
import com.nguyenquyen.dev.paymentservice.entity.PaymentMethod;
import com.nguyenquyen.dev.paymentservice.repository.PaymentMethodRepository;
import com.nguyenquyen.dev.paymentservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodResponse addPaymentMethod(PaymentMethodRequest request) {
        Long userId = UserContextHolder.getCurrentUserId();
        String userEmail = UserContextHolder.getCurrentUserEmail();

        PaymentMethod paymentMethod = PaymentMethod.builder()
                .userId(userId)
                .userEmail(userEmail)
                .type(request.getType())
                .isDefault(request.getIsDefault())
                .isActive(true)
                .build();

        // Process based on payment type
        if ("CREDIT_CARD".equals(request.getType())) {
            // In production, tokenize with Stripe/PayPal
            paymentMethod.setCardBrand(detectCardBrand(request.getCardNumber()));
            paymentMethod.setCardLast4(request.getCardNumber().substring(request.getCardNumber().length() - 4));
            paymentMethod.setCardExpMonth(request.getCardExpMonth());
            paymentMethod.setCardExpYear(request.getCardExpYear());
            paymentMethod.setPaymentGatewayId("pm_" + UUID.randomUUID().toString().substring(0, 24));
        } else if ("PAYPAL".equals(request.getType())) {
            paymentMethod.setPaypalEmail(request.getPaypalEmail());
            paymentMethod.setPaymentGatewayId("pp_" + UUID.randomUUID().toString().substring(0, 24));
        } else if ("BANK_TRANSFER".equals(request.getType())) {
            paymentMethod.setBankName(request.getBankName());
            paymentMethod.setBankAccountLast4(request.getBankAccountNumber().substring(
                    request.getBankAccountNumber().length() - 4));
            paymentMethod.setPaymentGatewayId("ba_" + UUID.randomUUID().toString().substring(0, 24));
        }

        // If this is set as default, unset other defaults
        if (request.getIsDefault()) {
            paymentMethodRepository.findByUserIdAndIsDefault(userId, true)
                    .ifPresent(pm -> {
                        pm.setIsDefault(false);
                        paymentMethodRepository.save(pm);
                    });
        }

        paymentMethod = paymentMethodRepository.save(paymentMethod);

        return mapToResponse(paymentMethod);
    }

    public List<PaymentMethodResponse> getMyPaymentMethods() {
        Long userId = UserContextHolder.getCurrentUserId();

        return paymentMethodRepository.findByUserIdAndIsActive(userId, true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deletePaymentMethod(Long id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!paymentMethod.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Access denied");
        }

        paymentMethod.setIsActive(false);
        paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethodResponse setDefaultPaymentMethod(Long id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        Long currentUserId = UserContextHolder.getCurrentUserId();
        if (!paymentMethod.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Access denied");
        }

        // Unset other defaults
        paymentMethodRepository.findByUserIdAndIsDefault(currentUserId, true)
                .ifPresent(pm -> {
                    pm.setIsDefault(false);
                    paymentMethodRepository.save(pm);
                });

        paymentMethod.setIsDefault(true);
        paymentMethod = paymentMethodRepository.save(paymentMethod);

        return mapToResponse(paymentMethod);
    }

    private String detectCardBrand(String cardNumber) {
        if (cardNumber.startsWith("4")) return "Visa";
        if (cardNumber.startsWith("5")) return "Mastercard";
        if (cardNumber.startsWith("3")) return "Amex";
        return "Unknown";
    }

    private PaymentMethodResponse mapToResponse(PaymentMethod pm) {
        return PaymentMethodResponse.builder()
                .id(pm.getId())
                .userId(pm.getUserId())
                .userEmail(pm.getUserEmail())
                .type(pm.getType())
                .cardBrand(pm.getCardBrand())
                .cardLast4(pm.getCardLast4())
                .cardExpMonth(pm.getCardExpMonth())
                .cardExpYear(pm.getCardExpYear())
                .paypalEmail(pm.getPaypalEmail())
                .bankName(pm.getBankName())
                .bankAccountLast4(pm.getBankAccountLast4())
                .isDefault(pm.getIsDefault())
                .isActive(pm.getIsActive())
                .createdAt(pm.getCreatedAt())
                .build();
    }
}
