package com.nguyenquyen.dev.dataservice;


import com.nguyenquyen.dev.dataservice.entity.DataCategory;
import com.nguyenquyen.dev.dataservice.repository.DataCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableJpaAuditing
@EnableDiscoveryClient
public class DataServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DataServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(DataCategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                List<DataCategory> categories = Arrays.asList(
                        DataCategory.builder()
                                .name("Driving Behavior")
                                .code("DRIVING_BEHAVIOR")
                                .description("Data về hành vi lái xe, tốc độ, gia tốc, phanh")
                                .type("DRIVING_BEHAVIOR")
                                .active(true)
                                .displayOrder(1)
                                .build(),

                        DataCategory.builder()
                                .name("Battery Performance")
                                .code("BATTERY_PERFORMANCE")
                                .description("Dữ liệu hiệu suất pin: SoC, SoH, nhiệt độ, chu kỳ sạc")
                                .type("BATTERY_PERFORMANCE")
                                .active(true)
                                .displayOrder(2)
                                .build(),

                        DataCategory.builder()
                                .name("Charging Station Usage")
                                .code("CHARGING_STATION")
                                .description("Dữ liệu sử dụng trạm sạc: thời gian, công suất, giá cả")
                                .type("CHARGING_STATION")
                                .active(true)
                                .displayOrder(3)
                                .build(),

                        DataCategory.builder()
                                .name("V2G Transactions")
                                .code("V2G_TRANSACTION")
                                .description("Giao dịch Vehicle-to-Grid: phát điện ngược lại lưới")
                                .type("V2G_TRANSACTION")
                                .active(true)
                                .displayOrder(4)
                                .build(),

                        DataCategory.builder()
                                .name("Trip Data")
                                .code("TRIP_DATA")
                                .description("Dữ liệu hành trình: quãng đường, thời gian, tiêu thụ năng lượng")
                                .type("TRIP_DATA")
                                .active(true)
                                .displayOrder(5)
                                .build(),

                        DataCategory.builder()
                                .name("Vehicle Diagnostics")
                                .code("VEHICLE_DIAGNOSTICS")
                                .description("Chẩn đoán xe: mã lỗi, bảo trì, hiệu suất hệ thống")
                                .type("VEHICLE_DIAGNOSTICS")
                                .active(true)
                                .displayOrder(6)
                                .build()
                );

                categoryRepository.saveAll(categories);

                System.out.println("=================================");
                System.out.println("Data Service Started");
                System.out.println("Initial data categories created:");
                categories.forEach(c -> System.out.println("- " + c.getName()));
                System.out.println("Registered with Eureka Server");
                System.out.println("=================================");
            }
        };
    }
}
