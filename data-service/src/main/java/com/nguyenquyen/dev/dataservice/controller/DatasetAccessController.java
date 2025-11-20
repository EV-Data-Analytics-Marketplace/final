package com.nguyenquyen.dev.dataservice.controller;

import com.nguyenquyen.dev.dataservice.dto.request.DatasetAccessRequest;
import com.nguyenquyen.dev.dataservice.dto.response.DatasetAccessResponse;
import com.nguyenquyen.dev.dataservice.service.DatasetAccessService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/access")
public class DatasetAccessController {

    @Autowired
    private DatasetAccessService accessService;

    @PostMapping("/grant")
    @PreAuthorize("hasAuthority('DATA_CONSUMER')")
    public ResponseEntity<?> grantAccess(@Valid @RequestBody DatasetAccessRequest request) {
        try {
            DatasetAccessResponse access = accessService.grantAccess(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(access);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to grant access", "error", e.getMessage()));
        }
    }

    @GetMapping("/my-accesses")
    public ResponseEntity<?> getMyAccesses() {
        try {
            List<DatasetAccessResponse> accesses = accessService.getMyAccesses();
            return ResponseEntity.ok(accesses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to fetch accesses", "error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAccessById(@PathVariable Long id) {
        try {
            DatasetAccessResponse access = accessService.getAccessById(id);
            return ResponseEntity.ok(access);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Access record not found", "error", e.getMessage()));
        }
    }

    @PostMapping("/download/{datasetId}")
    public ResponseEntity<?> recordDownload(@PathVariable Long datasetId) {
        try {
            accessService.recordDownload(datasetId);
            return ResponseEntity.ok(Map.of("message", "Download recorded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to record download", "error", e.getMessage()));
        }
    }

    @PostMapping("/api-call/{datasetId}")
    public ResponseEntity<?> recordApiCall(@PathVariable Long datasetId,
                                           @RequestParam String apiToken) {
        try {
            accessService.recordApiCall(datasetId, apiToken);
            return ResponseEntity.ok(Map.of("message", "API call recorded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to record API call", "error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/revoke")
    public ResponseEntity<?> revokeAccess(@PathVariable Long id) {
        try {
            accessService.revokeAccess(id);
            return ResponseEntity.ok(Map.of("message", "Access revoked successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to revoke access", "error", e.getMessage()));
        }
    }
}