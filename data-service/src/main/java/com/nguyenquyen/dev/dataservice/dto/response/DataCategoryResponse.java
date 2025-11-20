package com.nguyenquyen.dev.dataservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataCategoryResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private String iconUrl;
    private String type;
    private Boolean active;
    private Integer displayOrder;
    private Integer datasetCount;
    private LocalDateTime createdAt;
}
