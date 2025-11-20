package com.nguyenquyen.dev.dataservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatasetRatingResponse {

    private Long id;
    private Long datasetId;
    private Long userId;
    private String userEmail;
    private String userName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
