-- Advanced DuckDB Examples
-- Highlight any section and press Ctrl+Enter to execute
-- Or press Ctrl+Enter without selection to run the entire file

-- =============================================================================
-- 1. BASIC TABLE OPERATIONS
-- =============================================================================

-- Create table with various data types
CREATE OR REPLACE TABLE employees (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    department VARCHAR,
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    metadata JSON
);

-- Insert sample data
INSERT INTO employees VALUES
    (1, 'Alice Johnson', 'Engineering', 95000.00, '2022-01-15', true, '{"skills": ["Python", "SQL"], "level": "Senior"}'),
    (2, 'Bob Smith', 'Marketing', 65000.00, '2022-03-20', true, '{"skills": ["Analytics", "Communication"], "level": "Mid"}'),
    (3, 'Carol Davis', 'Engineering', 105000.00, '2021-08-10', true, '{"skills": ["Java", "Architecture"], "level": "Senior"}'),
    (4, 'David Wilson', 'Sales', 70000.00, '2023-01-05', true, '{"skills": ["Negotiation", "CRM"], "level": "Junior"}'),
    (5, 'Eva Brown', 'Engineering', 85000.00, '2022-11-30', false, '{"skills": ["JavaScript", "React"], "level": "Mid"}');

-- =============================================================================
-- 2. ANALYTICAL QUERIES
-- =============================================================================

-- Department analysis
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary,
    SUM(salary) as total_salary
FROM employees 
WHERE is_active = true
GROUP BY department
ORDER BY avg_salary DESC;

-- =============================================================================
-- 3. JSON OPERATIONS
-- =============================================================================

-- Extract JSON data
SELECT 
    name,
    department,
    salary,
    json_extract_string(metadata, '$.level') as level,
    json_extract(metadata, '$.skills') as skills
FROM employees;

-- Filter by JSON attributes
SELECT name, salary, metadata
FROM employees 
WHERE json_extract_string(metadata, '$.level') = 'Senior';

-- =============================================================================
-- 4. WINDOW FUNCTIONS
-- =============================================================================

-- Ranking within departments
SELECT 
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_salary_rank,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as overall_rank,
    LAG(salary) OVER (PARTITION BY department ORDER BY salary) as prev_salary_in_dept
FROM employees
WHERE is_active = true;

-- =============================================================================
-- 5. DATE OPERATIONS
-- =============================================================================

-- Tenure analysis
SELECT 
    name,
    hire_date,
    CURRENT_DATE - hire_date as days_employed,
    DATE_DIFF('month', hire_date, CURRENT_DATE) as months_employed,
    CASE 
        WHEN DATE_DIFF('year', hire_date, CURRENT_DATE) >= 2 THEN 'Veteran'
        WHEN DATE_DIFF('year', hire_date, CURRENT_DATE) >= 1 THEN 'Experienced'
        ELSE 'New'
    END as tenure_category
FROM employees
ORDER BY hire_date;

-- =============================================================================
-- 6. ADVANCED AGGREGATIONS
-- =============================================================================

-- Create a pivot-like summary
SELECT 
    department,
    COUNT(*) as total_employees,
    COUNT(*) FILTER (WHERE salary > 80000) as high_earners,
    COUNT(*) FILTER (WHERE DATE_DIFF('year', hire_date, CURRENT_DATE) >= 2) as veterans,
    ROUND(AVG(salary), 2) as avg_salary,
    STRING_AGG(name, ', ' ORDER BY salary DESC) as employee_list
FROM employees
WHERE is_active = true
GROUP BY department;

-- =============================================================================
-- 7. TEMPORARY TABLES AND CTEs
-- =============================================================================

-- Common Table Expression example
WITH salary_stats AS (
    SELECT 
        AVG(salary) as avg_salary,
        STDDEV(salary) as salary_stddev
    FROM employees
    WHERE is_active = true
),
categorized_employees AS (
    SELECT 
        e.*,
        CASE 
            WHEN e.salary > (s.avg_salary + s.salary_stddev) THEN 'Above Average+'
            WHEN e.salary > s.avg_salary THEN 'Above Average'
            WHEN e.salary > (s.avg_salary - s.salary_stddev) THEN 'Average'
            ELSE 'Below Average'
        END as salary_category
    FROM employees e
    CROSS JOIN salary_stats s
    WHERE e.is_active = true
)
SELECT 
    salary_category,
    COUNT(*) as employee_count,
    ROUND(AVG(salary), 2) as avg_salary_in_category
FROM categorized_employees
GROUP BY salary_category
ORDER BY avg_salary_in_category DESC;

-- =============================================================================
-- 8. UTILITY QUERIES
-- =============================================================================

-- Show table schema
DESCRIBE employees;

-- Show all tables
SHOW TABLES;

-- Table statistics
SELECT 
    'employees' as table_name,
    COUNT(*) as total_rows,
    COUNT(*) FILTER (WHERE is_active = true) as active_employees,
    MIN(hire_date) as earliest_hire,
    MAX(hire_date) as latest_hire
FROM employees;
