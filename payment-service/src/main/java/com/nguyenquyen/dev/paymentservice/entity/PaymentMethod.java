package com.nguyenquyen.dev.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String userEmail;

    // CREDIT_CARD, PAYPAL, BANK_TRANSFER
    @Column(nullable = false, length = 50)
    private String type;

    @Column(length = 100)
    private String cardBrand; // Visa, Mastercard, etc.

    @Column(length = 20)
    private String cardLast4;

    @Column(length = 10)
    private String cardExpMonth;

    @Column(length = 10)
    private String cardExpYear;

    @Column(length = 100)
    private String paypalEmail;

    @Column(length = 100)
    private String bankName;

    @Column(length = 50)
    private String bankAccountLast4;

    @Column(nullable = false)
    private Boolean isDefault = false;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(length = 200)
    private String paymentGatewayId; // Stripe customer/payment method ID

    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}