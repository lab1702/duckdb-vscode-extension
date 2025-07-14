-- DuckDB Sample Queries
-- Use Ctrl+Enter to execute:
-- 1. Selected text (if any text is highlighted)
-- 2. Current statement (cursor position within statement)
-- 3. Shows warning if no statement found
-- Use Ctrl+Shift+Enter to execute the entire file

-- Create a simple table (place cursor anywhere in this statement and press Ctrl+Enter)
CREATE TABLE users (
    id INTEGER,
    name VARCHAR,
    age INTEGER,
    city VARCHAR
);

-- Insert some sample data (cursor anywhere here works)
INSERT INTO users VALUES 
    (1, 'Alice', 25, 'New York'),
    (2, 'Bob', 30, 'San Francisco'),
    (3, 'Charlie', 35, 'Chicago'),
    (4, 'Diana', 28, 'Boston');

-- Simple query (cursor anywhere in this statement)
SELECT * FROM users;

-- Query with filtering (try placing cursor on different lines)
SELECT name, age 
FROM users 
WHERE age > 25;

-- Aggregate query
SELECT city, COUNT(*) as user_count, AVG(age) as avg_age 
FROM users 
GROUP BY city;

-- Multiple statements on separate lines - each can be executed individually
SELECT COUNT(*) FROM users;
SELECT AVG(age) FROM users;
SELECT MAX(age) FROM users;

-- Complex multi-line statement
SELECT 
    name,
    age,
    CASE 
        WHEN age < 30 THEN 'Young'
        WHEN age < 35 THEN 'Middle-aged'
        ELSE 'Senior'
    END as age_group
FROM users
ORDER BY age;

-- Comments are ignored
-- This is a comment line
SELECT 'Hello DuckDB!' as greeting;
