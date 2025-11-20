CREATE DATABASE IF NOT EXISTS ev_payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ev_payment_db;

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
                                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            transaction_id VARCHAR(100) NOT NULL UNIQUE,
    dataset_id BIGINT NOT NULL,
    dataset_name VARCHAR(200) NOT NULL,
    provider_id BIGINT NOT NULL,
    provider_name VARCHAR(200) NOT NULL,
    consumer_id BIGINT NOT NULL,
    consumer_name VARCHAR(200) NOT NULL,
    consumer_email VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    provider_revenue DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_gateway_id VARCHAR(200),
    payment_details TEXT,
    subscription_start_date DATETIME,
    subscription_end_date DATETIME,
    subscription_days INT,
    api_calls_limit INT,
    notes TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    completed_at DATETIME,
    INDEX idx_consumer_id (consumer_id),
    INDEX idx_provider_id (provider_id),
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_status (status),
    INDEX idx_transaction_type (transaction_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment Methods table
CREATE TABLE IF NOT EXISTS payment_methods (
                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                               user_id BIGINT NOT NULL,
                                               user_email VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    card_brand VARCHAR(100),
    card_last4 VARCHAR(20),
    card_exp_month VARCHAR(10),
    card_exp_year VARCHAR(10),
    paypal_email VARCHAR(100),
    bank_name VARCHAR(100),
    bank_account_last4 VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    payment_gateway_id VARCHAR(200),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Provider Revenues table
CREATE TABLE IF NOT EXISTS provider_revenues (
                                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                 provider_id BIGINT NOT NULL,
                                                 provider_name VARCHAR(200) NOT NULL,
    provider_email VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    net_revenue DECIMAL(10,2) NOT NULL,
    total_transactions INT NOT NULL,
    total_datasets INT NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME,
    payment_reference VARCHAR(100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY unique_provider_period (provider_id, year, month),
    INDEX idx_provider_id (provider_id),
    INDEX idx_payment_status (payment_status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refunds table
CREATE TABLE IF NOT EXISTS refunds (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       refund_id VARCHAR(100) NOT NULL UNIQUE,
    transaction_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    requested_by BIGINT NOT NULL,
    requested_by_name VARCHAR(200),
    approved_by BIGINT,
    approved_by_name VARCHAR(200),
    approved_at DATETIME,
    payment_gateway_refund_id VARCHAR(200),
    created_at DATETIME NOT NULL,
    completed_at DATETIME,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;