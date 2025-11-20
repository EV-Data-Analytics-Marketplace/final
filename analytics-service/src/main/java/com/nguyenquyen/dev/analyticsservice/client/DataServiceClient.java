package com.nguyenquyen.dev.analyticsservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

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
            throw new RuntimeException("Failed to fetch dataset info from Data Service", e);
        }
    }
}
