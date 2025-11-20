package com.nguyenquyen.dev.paymentservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableDiscoveryClient
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            System.out.println("=================================");
            System.out.println("Payment Service Started");
            System.out.println("Platform Commission Rate: 15%");
            System.out.println("Provider Revenue Share: 85%");
            System.out.println("Registered with Eureka Server");
            System.out.println("=================================");
        };
    }
}


