-- DuckDB VS Code Extension - Quick Start & Testing
-- ================================================
-- This file demonstrates and tests the DuckDB VS Code extension functionality
-- 
-- EXTENSION FEATURES TO TEST:
-- • Ctrl+Enter: Execute selected text, current statement, or statement at cursor
-- • Ctrl+Shift+Enter: Execute the entire file
-- • Statement parsing and cursor advancement
-- • Error handling and user feedback
--
-- CURSOR BEHAVIOR TESTING:
-- This file serves as a comprehensive test for cursor positioning and advancement.
-- Try placing your cursor at different positions within statements to test the extension.
--
-- TIP: Place your cursor anywhere within a statement and press Ctrl+Enter to execute it

-- =============================================================================
-- 0. DATABASE FILE SETUP (OPTIONAL)
-- =============================================================================

-- By default, DuckDB runs in memory mode (:memory:) - data is temporary
-- To use a persistent database file, uncomment and modify the line below:
-- .open ./test_database.duckdb

-- Alternative: Create a new empty database file
-- .open --new ./my_new_database.duckdb

-- Or open an existing file read-only for safety
-- .open --readonly ./existing_data.duckdb

-- =============================================================================
-- 1. EXTENSION FUNCTIONALITY TEST - BASIC OPERATIONS
-- =============================================================================

-- Statement 1: Create a sample table with various columns
CREATE TABLE users (
    id INTEGER,
    name VARCHAR,
    age INTEGER,
    city VARCHAR,
    email VARCHAR
);

-- Statement 2: Insert sample data (cursor anywhere in this block works)
INSERT INTO users VALUES 
    (1, 'Alice', 25, 'New York', 'alice@example.com'),
    (2, 'Bob', 30, 'San Francisco', 'bob@example.com'),
    (3, 'Charlie', 35, 'Chicago', 'charlie@example.com'),
    (4, 'Diana', 28, 'Boston', 'diana@example.com'),
    (5, 'Eve', 32, 'Seattle', 'eve@example.com');

-- =============================================================================
-- 2. STATEMENT PARSING TESTS
-- =============================================================================

-- Statement 3: View all data (try placing cursor on different lines)
SELECT * FROM users;

-- Statement 4: Query with filtering
SELECT name, age, city 
FROM users 
WHERE age > 28;

-- Statement 5: Query with multiple conditions
SELECT name, email
FROM users 
WHERE age BETWEEN 25 AND 32 
  AND city IN ('New York', 'Boston', 'Seattle');

-- =============================================================================
-- 3. MULTI-LINE STATEMENT HANDLING
-- =============================================================================

-- Statement 6: Count users by city
SELECT city, COUNT(*) as user_count, AVG(age) as avg_age 
FROM users 
GROUP BY city
ORDER BY user_count DESC;

-- Statement 7: Age group analysis
SELECT 
    CASE 
        WHEN age < 30 THEN 'Young (< 30)'
        WHEN age < 35 THEN 'Middle-aged (30-34)'
        ELSE 'Mature (35+)'
    END as age_group,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY age) as names
FROM users
GROUP BY age_group
ORDER BY MIN(age);

-- =============================================================================
-- 4. INDIVIDUAL STATEMENT EXECUTION EXAMPLES
-- =============================================================================

-- Each of these can be executed individually - place cursor and press Ctrl+Enter
SELECT COUNT(*) as total_users FROM users;
SELECT AVG(age) as average_age FROM users;
SELECT MAX(age) as oldest_user FROM users;
SELECT MIN(age) as youngest_user FROM users;

-- =============================================================================
-- 5. COMPLEX MULTI-LINE STATEMENT
-- =============================================================================

-- Statement 8: Complex query demonstrating cursor behavior in multi-line statements
SELECT 
    name,
    age,
    city,
    CASE 
        WHEN age < 30 THEN 'Young Professional'
        WHEN age < 35 THEN 'Experienced Professional'
        ELSE 'Senior Professional'
    END as career_stage,
    CASE
        WHEN city IN ('New York', 'San Francisco') THEN 'High Cost Area'
        WHEN city IN ('Chicago', 'Boston') THEN 'Medium Cost Area'
        ELSE 'Other Area'
    END as cost_category
FROM users
WHERE age IS NOT NULL
ORDER BY age, name;

-- =============================================================================
-- 6. UTILITY AND CLEANUP
-- =============================================================================

-- Statement 9: Show table information
DESCRIBE users;

-- Statement 10: Get table statistics
SELECT 
    'users' as table_name,
    COUNT(*) as row_count,
    COUNT(DISTINCT city) as unique_cities,
    MIN(age) as min_age,
    MAX(age) as max_age,
    ROUND(AVG(age), 1) as avg_age
FROM users;

-- Statement 11: Cleanup - drop the table when done
-- (Uncomment the line below to execute)
-- DROP TABLE users;

-- =============================================================================
-- 7. CURSOR BEHAVIOR EDGE CASES
-- =============================================================================

-- Test inline comments and tricky scenarios
SELECT 'inline comment test' /* this is inline */ as test_case;

-- Test multiple statements on same line (each can be executed separately)
SELECT 'first' as part; SELECT 'second' as part;

-- Test string literals containing semicolons (should not break statement parsing)
SELECT 'String with ; semicolon inside' as tricky_string;

-- Test empty lines and spacing (cursor should handle gracefully)


SELECT 'after empty lines' as spacing_test;

-- Statement followed by comment (comment should not affect cursor movement)
SELECT 'statement with comment below' as test;
-- This comment should not interfere with cursor behavior

-- =============================================================================
-- 8. TESTING FEATURES
-- =============================================================================

-- Comments are ignored during execution
-- This is a comment line that won't be executed
SELECT 'Hello DuckDB!' as greeting, CURRENT_DATE as today;

-- Test statement separation - these are separate statements
SELECT 'First statement' as test;
SELECT 'Second statement' as test;
SELECT 'Third statement' as test;

-- Final statement to test cursor advancement
SELECT 'Extension working correctly!' as status;
