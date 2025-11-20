package com.nguyenquyen.dev.analyticsservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@EnableJpaAuditing
public class AnalyticsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalyticsServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData() {
		return args -> {
			System.out.println("=================================");
			System.out.println("Analytics Service Started");
			System.out.println("Available Analysis Types:");
			System.out.println("- BATTERY_HEALTH: Battery performance analysis");
			System.out.println("- CHARGING_PATTERN: Charging behavior analysis");
			System.out.println("- RANGE_ANALYSIS: Range efficiency analysis");
			System.out.println("- ENERGY_CONSUMPTION: Energy usage analysis");
			System.out.println();
			System.out.println("Available Prediction Types:");
			System.out.println("- BATTERY_DEGRADATION: Battery lifecycle prediction");
			System.out.println("- CHARGING_DEMAND: Charging infrastructure forecasting");
			System.out.println("- RANGE_PREDICTION: Range estimation");
			System.out.println("- MAINTENANCE_PREDICTION: Maintenance scheduling");
			System.out.println();
			System.out.println("Dashboard Types:");
			System.out.println("- OVERVIEW: General analytics overview");
			System.out.println("- BATTERY: Battery-focused dashboard");
			System.out.println("- CHARGING: Charging-focused dashboard");
			System.out.println("- PERFORMANCE: Performance metrics dashboard");
			System.out.println("=================================");
		};
	}
}