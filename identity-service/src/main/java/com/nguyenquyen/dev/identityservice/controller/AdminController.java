package com.nguyenquyen.dev.identityservice.controller;

import com.nguyenquyen.dev.identityservice.dto.response.UserResponse;
import com.nguyenquyen.dev.identityservice.entity.RefreshToken;
import com.nguyenquyen.dev.identityservice.entity.User;
import com.nguyenquyen.dev.identityservice.repository.RefreshTokenRepository;
import com.nguyenquyen.dev.identityservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(Map.of(
                    "total", users.size(),
                    "users", users
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch users", "error", e.getMessage()));
        }
    }

    @GetMapping("/users/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            List<User> allUsers = userService.getAllUsers().stream()
                    .map(ur -> User.builder()
                            .role(ur.getRole())
                            .status(ur.getStatus())
                            .build())
                    .collect(Collectors.toList());

            long totalUsers = allUsers.size();
            long activeUsers = allUsers.stream()
                    .filter(u -> "ACTIVE".equals(u.getStatus()))
                    .count();
            long dataConsumers = allUsers.stream()
                    .filter(u -> "DATA_CONSUMER".equals(u.getRole()))
                    .count();
            long dataProviders = allUsers.stream()
                    .filter(u -> "DATA_PROVIDER".equals(u.getRole()))
                    .count();
            long admins = allUsers.stream()
                    .filter(u -> "ADMIN".equals(u.getRole()))
                    .count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            stats.put("dataConsumers", dataConsumers);
            stats.put("dataProviders", dataProviders);
            stats.put("admins", admins);
            stats.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch stats", "error", e.getMessage()));
        }
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            List<UserResponse> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(Map.of(
                    "role", role,
                    "count", users.size(),
                    "users", users
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch users", "error", e.getMessage()));
        }
    }

    @GetMapping("/users/status/{status}")
    public ResponseEntity<?> getUsersByStatus(@PathVariable String status) {
        try {
            List<UserResponse> users = userService.getUsersByStatus(status);
            return ResponseEntity.ok(Map.of(
                    "status", status,
                    "count", users.size(),
                    "users", users
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch users", "error", e.getMessage()));
        }
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id,
                                              @RequestParam String status) {
        try {
            UserResponse response = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Status update failed", "error", e.getMessage()));
        }
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                            @RequestParam String role) {
        try {
            UserResponse response = userService.updateUserRole(id, role);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Role update failed", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of(
                    "message", "User deleted successfully",
                    "userId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Delete failed", "error", e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<?> suspendUser(@PathVariable Long id,
                                         @RequestParam(required = false) String reason) {
        try {
            UserResponse response = userService.updateUserStatus(id, "SUSPENDED");

            return ResponseEntity.ok(Map.of(
                    "message", "User suspended successfully",
                    "user", response,
                    "reason", reason != null ? reason : "No reason provided"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Suspend failed", "error", e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long id) {
        try {
            UserResponse response = userService.updateUserStatus(id, "ACTIVE");

            return ResponseEntity.ok(Map.of(
                    "message", "User activated successfully",
                    "user", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Activation failed", "error", e.getMessage()));
        }
    }

    @GetMapping("/tokens/stats")
    public ResponseEntity<?> getTokenStats() {
        try {
            long totalTokens = refreshTokenRepository.count();
            long expiredTokens = refreshTokenRepository.findAll().stream()
                    .filter(RefreshToken::isExpired)
                    .count();
            long revokedTokens = refreshTokenRepository.findAll().stream()
                    .filter(RefreshToken::getRevoked)
                    .count();
            long activeTokens = totalTokens - expiredTokens - revokedTokens;

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalTokens", totalTokens);
            stats.put("activeTokens", activeTokens);
            stats.put("expiredTokens", expiredTokens);
            stats.put("revokedTokens", revokedTokens);
            stats.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch token stats", "error", e.getMessage()));
        }
    }
}