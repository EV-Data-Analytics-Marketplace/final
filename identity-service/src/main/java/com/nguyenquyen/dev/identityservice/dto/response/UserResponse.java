package com.nguyenquyen.dev.identityservice.dto.response;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String organization;
    private String role;
    private String status;
    private Boolean emailVerified;
    private String address;
    private String country;
    private String city;
    private String avatar;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}