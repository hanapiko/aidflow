-- Insert sample projects
INSERT INTO projects (title, description, target_amount, current_amount) VALUES
('Community Water Project', 'Help provide clean water access to rural communities through borehole drilling and water tank installation.', 500000, 0),
('Education Scholarship Fund', 'Support bright students from underprivileged backgrounds to access quality education.', 300000, 0),
('Healthcare Outreach Program', 'Fund mobile clinics to reach remote areas with essential healthcare services.', 450000, 0);

-- Insert sample donations (optional, for testing)
INSERT INTO donations (project_id, amount, transaction_id, status) VALUES
(1, 5000, 'TEST-TRANS-001', 'completed'),
(2, 3000, 'TEST-TRANS-002', 'completed'),
(3, 7000, 'TEST-TRANS-003', 'completed'); 