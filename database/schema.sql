-- ============================================================
-- VIDYASETU DATABASE SCHEMA
-- Run this SQL in MySQL to set up the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS vidyasetu;
USE vidyasetu;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('donor', 'ngo') DEFAULT 'donor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP TABLE
CREATE TABLE IF NOT EXISTS otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  donor_name VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'UPI',
  status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  receipt_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  added_by INT NOT NULL,
  expense_name VARCHAR(200) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_category ON donations(category);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_otps_email ON otps(email);