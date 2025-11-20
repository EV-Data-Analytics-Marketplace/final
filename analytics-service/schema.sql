-- Create Database
CREATE DATABASE IF NOT EXISTS ev_analytics_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ev_analytics_db;

-- Analysis Reports Table
CREATE TABLE IF NOT EXISTS analysis_reports (
                                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                report_id VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    dataset_id BIGINT,
    dataset_name VARCHAR(200),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    parameters JSON,
    results JSON,
    charts JSON,
    insights JSON,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    completed_at DATETIME,
    INDEX idx_user_id (user_id),
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_status (status),
    INDEX idx_report_type (report_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dashboards Table
CREATE TABLE IF NOT EXISTS dashboards (
                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                          dashboard_id VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    dashboard_type VARCHAR(50) NOT NULL,
    config JSON,
    widgets JSON,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    is_template BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_dashboard_type (dashboard_type),
    INDEX idx_is_public (is_public)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI Predictions Table
CREATE TABLE IF NOT EXISTS ai_predictions (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              prediction_id VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    dataset_id BIGINT,
    prediction_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    input_data JSON,
    prediction_result JSON,
    confidence_score DOUBLE,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at DATETIME NOT NULL,
    completed_at DATETIME,
    INDEX idx_user_id (user_id),
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_prediction_type (prediction_type),
    INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics Metrics Table
CREATE TABLE IF NOT EXISTS analytics_metrics (
                                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                 metric_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DOUBLE NOT NULL,
    metric_unit VARCHAR(50),
    aggregation_period VARCHAR(50) NOT NULL,
    period_start DATETIME NOT NULL,
    period_end DATETIME NOT NULL,
    metadata JSON,
    created_at DATETIME NOT NULL,
    INDEX idx_metric_type (metric_type),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_period (period_start, period_end)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insights Table
CREATE TABLE IF NOT EXISTS insights (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        insight_id VARCHAR(100) NOT NULL UNIQUE,
    insight_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL,
    confidence_score DOUBLE,
    dataset_id BIGINT,
    related_entities JSON,
    recommendations JSON,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    expires_at DATETIME,
    INDEX idx_insight_type (insight_type),
    INDEX idx_category (category),
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Quality Scores Table
CREATE TABLE IF NOT EXISTS data_quality_scores (
                                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                   dataset_id BIGINT NOT NULL,
                                                   completeness_score DOUBLE NOT NULL,
                                                   accuracy_score DOUBLE NOT NULL,
                                                   consistency_score DOUBLE NOT NULL,
                                                   timeliness_score DOUBLE NOT NULL,
                                                   overall_score DOUBLE NOT NULL,
                                                   issues JSON,
                                                   recommendations JSON,
                                                   assessed_at DATETIME NOT NULL,
                                                   INDEX idx_dataset_id (dataset_id),
    INDEX idx_overall_score (overall_score)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;