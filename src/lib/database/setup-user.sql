-- Create application user
CREATE USER IF NOT EXISTS 'aidflow_user'@'localhost' IDENTIFIED BY 'aidflow123';

-- Grant privileges
GRANT ALL PRIVILEGES ON aidflow_db.* TO 'aidflow_user'@'localhost';
FLUSH PRIVILEGES; 