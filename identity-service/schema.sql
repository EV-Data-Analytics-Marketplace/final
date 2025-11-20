-- Create Database
CREATE DATABASE IF NOT EXISTS ev_identity_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ev_identity_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    organization VARCHAR(200),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    address VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    avatar TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    last_login_at DATETIME,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              token VARCHAR(500) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expiry_date (expiry_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Initial Admin User (password: admin123)
INSERT INTO users (email, password, full_name, role, status, email_verified, organization, created_at, updated_at)
VALUES (
           'admin@evdata.com',
           '$2a$10$8.Un0e4LRXKqVVQZwGzw5.KBvGqJvZp8UvZMQvLZ7YHvx7uWzGqWW',
           'System Admin',
           'ADMIN',
           'ACTIVE',
           TRUE,
           'EV Data Platform',
           NOW(),
           NOW()
       );