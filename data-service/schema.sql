-- Create Database
CREATE DATABASE IF NOT EXISTS ev_data_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ev_data_db;

-- Data Categories Table
CREATE TABLE IF NOT EXISTS data_categories (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_active (active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datasets Table
CREATE TABLE IF NOT EXISTS datasets (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        name VARCHAR(200) NOT NULL UNIQUE,
    code VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    provider_name VARCHAR(200) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    format VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    pricing_model VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    usage_rights VARCHAR(50) NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    data_start_date DATETIME,
    data_end_date DATETIME,
    file_url VARCHAR(500),
    file_size BIGINT,
    record_count INT,
    api_endpoint VARCHAR(500),
    api_key VARCHAR(100),
    tags TEXT,
    sample_data TEXT,
    dataset_schema JSON,
    download_count INT NOT NULL DEFAULT 0,
    view_count INT NOT NULL DEFAULT 0,
    purchase_count INT NOT NULL DEFAULT 0,
    rating DOUBLE NOT NULL DEFAULT 0.0,
    rating_count INT NOT NULL DEFAULT 0,
    anonymized BOOLEAN NOT NULL DEFAULT TRUE,
    gdpr_compliant BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    published_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES data_categories(id),
    INDEX idx_code (code),
    INDEX idx_provider (provider_id),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_pricing_model (pricing_model),
    INDEX idx_region (region),
    INDEX idx_country (country),
    FULLTEXT idx_search (name, description, tags)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dataset Accesses Table
CREATE TABLE IF NOT EXISTS dataset_accesses (
                                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                dataset_id BIGINT NOT NULL,
                                                user_id BIGINT NOT NULL,
                                                user_email VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    access_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    expires_at DATETIME,
    price_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    transaction_id VARCHAR(100),
    api_access_token VARCHAR(500),
    api_calls_limit INT NOT NULL DEFAULT 0,
    api_calls_used INT NOT NULL DEFAULT 0,
    download_count INT NOT NULL DEFAULT 0,
    last_accessed_at DATETIME,
    granted_at DATETIME NOT NULL,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    INDEX idx_dataset (dataset_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_access_type (access_type),
    INDEX idx_api_token (api_access_token)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dataset Ratings Table
CREATE TABLE IF NOT EXISTS dataset_ratings (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               dataset_id BIGINT NOT NULL,
                                               user_id BIGINT NOT NULL,
                                               user_email VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_rating (dataset_id, user_id),
    INDEX idx_dataset (dataset_id),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Initial Categories
INSERT INTO data_categories (name, code, description, type, active, display_order, created_at, updated_at)
VALUES
    ('Driving Behavior', 'DRIVING_BEHAVIOR', 'Data về hành vi lái xe, tốc độ, gia tốc, phanh', 'DRIVING_BEHAVIOR', TRUE, 1, NOW(), NOW()),
    ('Battery Performance', 'BATTERY_PERFORMANCE', 'Dữ liệu hiệu suất pin: SoC, SoH, nhiệt độ, chu kỳ sạc', 'BATTERY_PERFORMANCE', TRUE, 2, NOW(), NOW()),
    ('Charging Station Usage', 'CHARGING_STATION', 'Dữ liệu sử dụng trạm sạc: thời gian, công suất, giá cả', 'CHARGING_STATION', TRUE, 3, NOW(), NOW()),
    ('V2G Transactions', 'V2G_TRANSACTION', 'Giao dịch Vehicle-to-Grid: phát điện ngược lại lưới', 'V2G_TRANSACTION', TRUE, 4, NOW(), NOW()),
    ('Trip Data', 'TRIP_DATA', 'Dữ liệu hành trình: quãng đường, thời gian, tiêu thụ năng lượng', 'TRIP_DATA', TRUE, 5, NOW(), NOW()),
    ('Vehicle Diagnostics', 'VEHICLE_DIAGNOSTICS', 'Chẩn đoán xe: mã lỗi, bảo trì, hiệu suất hệ thống', 'VEHICLE_DIAGNOSTICS', TRUE, 6, NOW(), NOW());