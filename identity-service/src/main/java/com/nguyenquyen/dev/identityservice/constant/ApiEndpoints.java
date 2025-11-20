package com.nguyenquyen.dev.identityservice.constant;

public class ApiEndpoints {
    // Auth endpoints
    public static final String AUTH_BASE = "/api/auth";
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";
    public static final String REFRESH_TOKEN = "/refresh-token";
    public static final String LOGOUT = "/logout";

    // User endpoints
    public static final String USER_BASE = "/api/users";
    public static final String PROFILE = "/profile";
    public static final String CHANGE_PASSWORD = "/change-password";

    // Admin endpoints
    public static final String ADMIN_BASE = "/api/admin";

    private ApiEndpoints() {}
}
