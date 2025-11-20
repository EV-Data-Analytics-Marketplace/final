package com.nguyenquyen.dev.paymentservice.client;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;


@Component
public class DataServiceClient {

    @Value("${data.service.url}")
    private String dataServiceUrl;

    private final WebClient webClient;

    public DataServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    private String getJwtToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt) {
            org.springframework.security.oauth2.jwt.Jwt jwt = (org.springframework.security.oauth2.jwt.Jwt) authentication.getPrincipal();
            return jwt.getTokenValue();
        }
        return null;
    }

    public DatasetInfo getDatasetById(Long datasetId) {
        try {
            String token = getJwtToken();

            WebClient.RequestHeadersSpec<?> spec = webClient.get()
                    .uri(dataServiceUrl + "/api/datasets/" + datasetId);

            if (token != null) {
                spec = spec.header("Authorization", "Bearer " + token);
            }

            return spec.retrieve()
                    .bodyToMono(DatasetInfo.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
        } catch (Exception e) {
            System.err.println("Error fetching dataset: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch dataset info from Data Service", e);
        }
    }

    public void grantDatasetAccess(Long datasetId, Long userId, String accessType,
                                   Integer durationDays, Integer apiCallsLimit,
                                   String transactionId) {
        try {
            String token = getJwtToken();

            // Map accessType to what Data Service expects
            String dataAccessType;
            if ("PURCHASE".equals(accessType)) {
                dataAccessType = "DOWNLOAD";
            } else if ("SUBSCRIPTION".equals(accessType)) {
                dataAccessType = "SUBSCRIPTION";
            } else if ("API_ACCESS".equals(accessType)) {
                dataAccessType = "API";
            } else {
                dataAccessType = "DOWNLOAD"; // default
            }

            // Build request matching DatasetAccessRequest DTO
            Map<String, Object> request = new HashMap<>();
            request.put("datasetId", datasetId);
            request.put("accessType", dataAccessType);

            // Only add optional fields if they have values
            if (durationDays != null && durationDays > 0) {
                request.put("durationDays", durationDays);
            }
            if (apiCallsLimit != null && apiCallsLimit > 0) {
                request.put("apiCallsLimit", apiCallsLimit);
            }

            System.out.println("Granting dataset access with request: " + request);

            WebClient.RequestHeadersSpec<?> spec = webClient.post()
                    .uri(dataServiceUrl + "/api/access/grant")
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .bodyValue(request);

            if (token != null) {
                spec = spec.header("Authorization", "Bearer " + token);
            }

            spec.retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(5))
                    .doOnSuccess(response ->
                            System.out.println("Successfully granted dataset access for transaction: " + transactionId))
                    .doOnError(error ->
                            System.err.println("Failed to grant access: " + error.getMessage()))
                    .block();

        } catch (Exception e) {
            System.err.println("Error granting dataset access: " + e.getMessage());
            if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                org.springframework.web.reactive.function.client.WebClientResponseException webEx =
                        (org.springframework.web.reactive.function.client.WebClientResponseException) e;
                System.err.println("Response body: " + webEx.getResponseBodyAsString());
            }
            // Don't throw exception, just log warning - transaction is already saved
        }
    }
}