-- Sample SQL file to demonstrate DuckDB extension features
-- Use Ctrl+Enter to execute statements one by one (cursor will advance to next statement)
-- When you execute the last statement, cursor moves to an empty line below it
-- Use Ctrl+Shift+Enter to execute the entire file

-- Statement 1: Create a sample table
CREATE TABLE users (
    id INTEGER,
    name VARCHAR,
    age INTEGER
);

-- Statement 2: Insert some sample data
INSERT INTO users VALUES 
    (1, 'Alice', 25),
    (2, 'Bob', 30),
    (3, 'Charlie', 35);

-- Statement 3: Query the data
SELECT * FROM users;

-- Statement 4: Query with filtering
SELECT name, age 
FROM users 
WHERE age > 28;

-- Statement 5: Count users by age group
SELECT 
    CASE 
        WHEN age < 30 THEN 'Young'
        WHEN age >= 30 THEN 'Mature'
    END as age_group,
    COUNT(*) as count
FROM users
GROUP BY age_group;

-- Statement 6: Drop the table when done
DROP TABLE users;
