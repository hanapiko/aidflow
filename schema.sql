-- Create database
CREATE DATABASE IF NOT EXISTS aidflow_db;
USE aidflow_db;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    current_amount DECIMAL(10, 2) DEFAULT 0.00,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    phone_number VARCHAR(15),
    transaction_id VARCHAR(100),
    mpesa_receipt VARCHAR(50),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Insert sample projects
INSERT INTO projects (title, description, target_amount, current_amount, image_url) VALUES
(
    'Kibera Community Library Project',
    'Help us build a modern library and learning center in Kibera, Nairobi. This facility will provide free access to books, computers, and internet for over 1,000 students and community members. The library will include:\n\n- Reading rooms and study areas\n- Computer lab with 20 workstations\n- Children''s section with educational materials\n- Community meeting space\n\nYour donation will help purchase books, computers, furniture, and support construction costs.',
    2000000.00,
    750000.00,
    '/images/library-project.jpg'
),
(
    'Clean Water for Turkana',
    'Support our initiative to drill water wells in Turkana County, providing clean drinking water to remote communities. This project will:\n\n- Drill 5 deep water wells\n- Install solar-powered pumps\n- Train local communities in well maintenance\n- Benefit over 5,000 residents\n\nClean water access will improve health, reduce waterborne diseases, and allow children to attend school instead of walking long distances for water.',
    1500000.00,
    300000.00,
    '/images/water-project.jpg'
);

-- Create database user
DROP USER IF EXISTS 'aidflow_user'@'localhost';
CREATE USER 'aidflow_user'@'localhost' IDENTIFIED BY 'aidflow_pass';
GRANT ALL PRIVILEGES ON aidflow_db.* TO 'aidflow_user'@'localhost';
FLUSH PRIVILEGES; 