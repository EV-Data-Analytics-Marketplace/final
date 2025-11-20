package com.nguyenquyen.dev.dataservice.dto.request;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DataCategoryRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Code is required")
    private String code;

    private String description;

    private String iconUrl;

    @NotBlank(message = "Type is required")
    private String type;

    private Boolean active = true;

    private Integer displayOrder = 0;
}
