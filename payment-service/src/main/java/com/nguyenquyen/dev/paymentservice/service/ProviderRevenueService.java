package com.nguyenquyen.dev.paymentservice.service;

import com.nguyenquyen.dev.paymentservice.dto.response.ProviderRevenueResponse;
import com.nguyenquyen.dev.paymentservice.entity.ProviderRevenue;
import com.nguyenquyen.dev.paymentservice.entity.Transaction;
import com.nguyenquyen.dev.paymentservice.repository.ProviderRevenueRepository;
import com.nguyenquyen.dev.paymentservice.repository.TransactionRepository;
import com.nguyenquyen.dev.paymentservice.security.UserContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class ProviderRevenueService {

    @Autowired
    private ProviderRevenueRepository revenueRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public void calculateMonthlyRevenue(Integer year, Integer month) {
        // Get all completed transactions for the month
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);

        List<Transaction> transactions = transactionRepository
                .findByStatusAndDateRange("COMPLETED", startDate, endDate);

        // Group by provider
        Map<Long, List<Transaction>> transactionsByProvider = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getProviderId));

        transactionsByProvider.forEach((providerId, providerTransactions) -> {
            Transaction firstTransaction = providerTransactions.get(0);

            BigDecimal totalRevenue = providerTransactions.stream()
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal platformFee = providerTransactions.stream()
                    .map(Transaction::getPlatformFee)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal netRevenue = providerTransactions.stream()
                    .map(Transaction::getProviderRevenue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Set<Long> datasetIds = providerTransactions.stream()
                    .map(Transaction::getDatasetId)
                    .collect(Collectors.toSet());

            Optional<ProviderRevenue> existingRevenue = revenueRepository
                    .findByProviderIdAndYearAndMonth(providerId, year, month);

            ProviderRevenue revenue;
            if (existingRevenue.isPresent()) {
                revenue = existingRevenue.get();
                revenue.setTotalRevenue(totalRevenue);
                revenue.setPlatformFee(platformFee);
                revenue.setNetRevenue(netRevenue);
                revenue.setTotalTransactions(providerTransactions.size());
                revenue.setTotalDatasets(datasetIds.size());
            } else {
                revenue = ProviderRevenue.builder()
                        .providerId(providerId)
                        .providerName(firstTransaction.getProviderName())
                        .providerEmail("") // Will be fetched from Identity Service
                        .year(year)
                        .month(month)
                        .totalRevenue(totalRevenue)
                        .platformFee(platformFee)
                        .netRevenue(netRevenue)
                        .totalTransactions(providerTransactions.size())
                        .totalDatasets(datasetIds.size())
                        .paymentStatus("PENDING")
                        .build();
            }

            revenueRepository.save(revenue);
        });
    }

    public List<ProviderRevenueResponse> getMyRevenue() {
        Long providerId = UserContextHolder.getCurrentUserId();

        return revenueRepository.findByProviderId(providerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProviderRevenueResponse getRevenueByMonth(Integer year, Integer month) {
        Long providerId = UserContextHolder.getCurrentUserId();

        ProviderRevenue revenue = revenueRepository
                .findByProviderIdAndYearAndMonth(providerId, year, month)
                .orElseThrow(() -> new RuntimeException("No revenue data for this period"));

        return mapToResponse(revenue);
    }

    public BigDecimal getTotalEarnings() {
        Long providerId = UserContextHolder.getCurrentUserId();
        BigDecimal total = revenueRepository.sumPaidRevenue(providerId);
        return total != null ? total : BigDecimal.ZERO;
    }

    private ProviderRevenueResponse mapToResponse(ProviderRevenue revenue) {
        return ProviderRevenueResponse.builder()
                .id(revenue.getId())
                .providerId(revenue.getProviderId())
                .providerName(revenue.getProviderName())
                .providerEmail(revenue.getProviderEmail())
                .year(revenue.getYear())
                .month(revenue.getMonth())
                .totalRevenue(revenue.getTotalRevenue())
                .platformFee(revenue.getPlatformFee())
                .netRevenue(revenue.getNetRevenue())
                .totalTransactions(revenue.getTotalTransactions())
                .totalDatasets(revenue.getTotalDatasets())
                .paymentStatus(revenue.getPaymentStatus())
                .paidAt(revenue.getPaidAt())
                .paymentReference(revenue.getPaymentReference())
                .createdAt(revenue.getCreatedAt())
                .build();
    }
}