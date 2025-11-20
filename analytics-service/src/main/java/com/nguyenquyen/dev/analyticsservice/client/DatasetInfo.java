package com.nguyenquyen.dev.analyticsservice.client;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetInfo {
    private Long id;
    private String name;
    private String code;
    private String status;
}
