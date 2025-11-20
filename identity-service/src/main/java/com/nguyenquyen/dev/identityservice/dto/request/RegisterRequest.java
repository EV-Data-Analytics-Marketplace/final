package com.nguyenquyen.dev.identityservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;

    private String organization;

    @NotBlank(message = "Role is required")
    private String role; // DATA_CONSUMER, DATA_PROVIDER, ADMIN

    private String address;
    private String country;
    private String city;
}