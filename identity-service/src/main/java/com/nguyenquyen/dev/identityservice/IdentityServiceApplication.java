package com.nguyenquyen.dev.identityservice;

import com.nguyenquyen.dev.identityservice.entity.User;
import com.nguyenquyen.dev.identityservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@SpringBootApplication
@EnableJpaAuditing
@EnableDiscoveryClient
public class IdentityServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(IdentityServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .email("admin@evdata.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Admin")
                        .role("ADMIN")
                        .status("ACTIVE")
                        .emailVerified(true)
                        .organization("EV Data Platform")
                        .build();

                User dataProvider = User.builder()
                        .email("provider@tesla.com")
                        .password(passwordEncoder.encode("provider123"))
                        .fullName("Tesla Data Team")
                        .role("DATA_PROVIDER")
                        .status("ACTIVE")
                        .emailVerified(true)
                        .organization("Tesla Inc.")
                        .build();

                User dataConsumer = User.builder()
                        .email("consumer@startup.com")
                        .password(passwordEncoder.encode("consumer123"))
                        .fullName("Research Team")
                        .role("DATA_CONSUMER")
                        .status("ACTIVE")
                        .emailVerified(true)
                        .organization("EV Startup Research")
                        .build();

                userRepository.saveAll(Arrays.asList(admin, dataProvider, dataConsumer));

                System.out.println("=================================");
                System.out.println("Identity Service Started");
                System.out.println("Initial users created:");
                System.out.println("Admin: admin@evdata.com / admin123");
                System.out.println("Provider: provider@tesla.com / provider123");
                System.out.println("Consumer: consumer@startup.com / consumer123");
                System.out.println("Registered with Eureka Server");
                System.out.println("=================================");
            }
        };
    }
}