# Change Log

All notable changes to the "duckdb-ext" extension will be documented in this file.

## [0.0.4] - 2025-07-15

### Added

- **Enhanced Documentation**: Comprehensive documentation consolidation and improvements
  - Merged quick start guide into main README for single source of truth
  - Added detailed instructions for working with persistent DuckDB files
  - Enhanced troubleshooting section with file-related issues
  - Improved example workflows and usage patterns

### Improved

- **Code Quality**: Applied best practices and code improvements
  - Added error handling for terminal creation with try-catch blocks
  - Extracted magic numbers into named constants for better maintainability
  - Enhanced package.json with proper publisher, keywords, and categories
  - Fixed TypeScript compilation issues and removed unused variables
- **User Experience**: Simplified onboarding process
  - Reduced quick start from 3 steps to 2 steps (automatic terminal creation)
  - Enhanced quick_start.sql with database file setup examples
  - Improved documentation structure and readability

### Documentation & File Consolidation

- **File Consolidation**: Eliminated redundant documentation files
  - Removed duplicate content between README.md and QUICK_START.md
  - Consolidated SQL example files (demo.sql, sample.sql) into single quick_start.sql
  - Removed advanced_queries.sql (was more of a DuckDB tutorial than extension demo)

## [0.0.3] - 2025-07-14

### Fixed

- **Cursor Position Behavior**: Fixed issue where pressing `Ctrl+Enter` when positioned after the last statement would re-execute the last statement. Now properly shows "No SQL statement found at cursor position" warning when cursor is positioned in empty space after all statements
- **Statement Detection Logic**: Improved statement detection to prevent accidental execution when cursor is on empty lines or positioned after all file content
- **Boundary Validation**: Enhanced cursor position validation to ensure statements are only executed when cursor is actually within statement boundaries

## [0.0.2] - 2025-07-14

### Improvements

- **Focus Management**: Fixed issue where focus was not returning to the editor after executing statements with `Ctrl+Enter`. The editor now properly regains focus after query execution, allowing for seamless statement-by-statement execution workflow

### Initial Features

- **DuckDB Terminal Integration**: Create and manage DuckDB CLI terminal sessions directly from VS Code
- **Smart Query Execution**: Execute SQL queries with precise control:
  - **Selection Mode** (`Ctrl+Enter`): Execute only the highlighted/selected SQL text
  - **Statement Mode** (`Ctrl+Enter`): If no text is selected, execute the SQL statement where the cursor is positioned
  - **Full File Mode** (`Ctrl+Shift+Enter`): Execute the entire file content
- **Intelligent Navigation**: After executing a statement with `Ctrl+Enter`, the cursor automatically moves to the beginning of the next statement for seamless workflow. When executing the last statement, the cursor moves to an empty line below it (inserting a newline if needed) to prevent accidental re-execution
- **Safety Features**: `Ctrl+Enter` shows a warning when no statement is found at cursor position, preventing accidental full-file execution
- **Seamless Workflow**: Focus automatically returns to editor after query execution, enabling rapid statement-by-statement execution with repeated `Ctrl+Enter`
- **Multi-Mode Execution**:
  - **Selection Mode**: When text is selected, execute only the selection
  - **Statement Mode**: When no text is selected, intelligently find and execute the statement at cursor position
  - **File Mode**: Dedicated shortcut (`Ctrl+Shift+Enter`) to execute entire file
- **Automatic Terminal Management**: Creates DuckDB terminal automatically if none exists
- **Configuration Settings**:
  - `duckdb.cliPath`: Configure path to DuckDB CLI executable (default: "duckdb")
  - `duckdb.defaultDatabase`: Set default database (default: ":memory:" for in-memory)
- **SQL File Support**: Extension activates automatically when working with `.sql` files
- **Commands**:
  - `DuckDB: Create Terminal Session` - Manual terminal creation
  - `DuckDB: Execute Query (Smart Detection)` - Smart selection/statement execution (`Ctrl+Enter`)
  - `DuckDB: Execute Selection` - Selected text only (command palette)
  - `DuckDB: Execute Entire File` - Full file content (`Ctrl+Shift+Enter`)
- **Comprehensive Testing**: Full test suite with extension activation, command verification, and statement detection

### Technical Details

- Built with TypeScript for robust type safety
- VS Code API 1.102.0 compatibility
- ESLint integration for code quality
- Mocha test framework with comprehensive coverage
- Extension activation on SQL language detection
- Async/await implementation for smooth file editing operations
- Advanced text parsing for SQL statement boundary detection