-- Add status and error_message columns to donations table
ALTER TABLE donations 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN error_message TEXT; 