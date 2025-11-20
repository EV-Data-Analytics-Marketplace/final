package com.nguyenquyen.dev.identityservice.security;

import com.nguyenquyen.dev.identityservice.entity.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration; // milliseconds

    @Value("${jwt.refresh.expiration}")
    private Long refreshExpiration;

    // Trình ký (Signer) - dùng để tạo token
    private JWSSigner signer;

    // Trình xác thực (Verifier) - dùng để đọc/validate token
    private JWSVerifier verifier;

    // Header cho JWS
    private JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);

    // Hàm khởi tạo, chạy khi Spring tạo bean này
    @Value("${jwt.secret}")
    public void init(@Value("${jwt.secret}") String secret) throws JOSEException {
        // Khởi tạo signer và verifier MỘT LẦN với key bí mật
        this.signer = new MACSigner(secret.getBytes());
        this.verifier = new MACVerifier(secret.getBytes());
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(now)
                .expirationTime(expiryDate)
                .claim("userId", user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .claim("fullName", user.getFullName())
                .build();

        SignedJWT signedJWT = new SignedJWT(jwsHeader, claimsSet);

        try {
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (JOSEException e) {
            // Xử lý lỗi
            throw new RuntimeException("Error signing token", e);
        }
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpiration);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(now)
                .expirationTime(expiryDate)
                .build();

        SignedJWT signedJWT = new SignedJWT(jwsHeader, claimsSet);

        try {
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Error signing refresh token", e);
        }
    }

    // Trích xuất tất cả claims từ token
    private JWTClaimsSet extractAllClaims(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            if (!signedJWT.verify(verifier)) {
                throw new RuntimeException("Invalid token signature");
            }
            return signedJWT.getJWTClaimsSet();
        } catch (ParseException | JOSEException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    // Các hàm helper
    public String extractEmail(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public Long extractUserId(String token) {
        try {
            return extractAllClaims(token).getLongClaim("userId");
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            return extractAllClaims(token).getStringClaim("role");
        } catch (Exception e) {
            return null;
        }
    }

    public Date extractExpiration(String token) {
        try {
            return extractAllClaims(token).getExpirationTime();
        } catch (Exception e) {
            return null;
        }
    }

    public Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration != null && expiration.before(new Date());
    }

    // Bạn có thể không cần hàm này nữa nếu dùng JwtDecoder của Spring
    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            JWTClaimsSet claims = extractAllClaims(token); // đã bao gồm check signature
            String email = claims.getSubject();
            Date expiration = claims.getExpirationTime();

            return (email.equals(userDetails.getUsername()) && expiration.after(new Date()));
        } catch (Exception e) {
            return false;
        }
    }

    // Dùng để kiểm tra token đơn giản (signature + expiration)
    public Boolean validateToken(String token) {
        try {
            JWTClaimsSet claims = extractAllClaims(token); // đã bao gồm check signature
            return claims.getExpirationTime().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public Long getExpirationTime() {
        return jwtExpiration / 1000; // seconds
    }
}