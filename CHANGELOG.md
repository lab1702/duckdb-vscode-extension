# Change Log

All notable changes to the "duckdb-ext" extension will be documented in this file.

## [0.0.2] - 2025-07-14

### Fixed

- **Focus Management**: Fixed issue where focus was not returning to the editor after executing statements with `Ctrl+Enter`. The editor now properly regains focus after query execution, allowing for seamless statement-by-statement execution workflow

## [0.0.1] - 2025-07-14

### Added

- **DuckDB Terminal Integration**: Create and manage DuckDB CLI terminal sessions directly from VS Code
- **Smart Query Execution**: Two distinct keyboard shortcuts for precise control:
  - **`Ctrl+Enter`**: Execute selected text OR current SQL statement (with intelligent statement detection)
  - **`Ctrl+Shift+Enter`**: Execute entire file content
- **Intelligent Statement Detection**: Automatically finds and executes the complete SQL statement where your cursor is positioned, using semicolon (`;`) boundaries
- **Smart Navigation**: After executing a statement with `Ctrl+Enter`, cursor automatically moves to the beginning of the next statement for seamless workflow. When executing the last statement, cursor moves to an empty line below it (inserting newline if needed) to prevent accidental re-execution
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

### Features

- **Precise Control**: Clear separation between statement execution (`Ctrl+Enter`) and file execution (`Ctrl+Shift+Enter`)
- **User Safety**: No accidental execution of entire files when intending to run a single statement
- **Cursor-Based Intelligence**: Place cursor anywhere within a SQL statement and execute with `Ctrl+Enter`
- **Multi-line Statement Support**: Handles complex SQL statements spanning multiple lines correctly
- **Semicolon-Aware Parsing**: Accurately identifies statement boundaries using semicolons
- **Automatic Cursor Advancement**: Step through SQL files statement-by-statement with repeated `Ctrl+Enter`
- **Last Statement Handling**: Intelligent cursor positioning after executing the final statement in a file
- **Clear User Feedback**: Distinct messages for each execution mode and warnings when statements aren't found
- **Keyboard Shortcuts**: Intuitive shortcuts optimized for SQL development workflow
- **Editor Integration**: Seamless interaction between SQL editor and DuckDB CLI terminal
- **Terminal Management**: Automatic terminal creation and cleanup
- **Configurable Settings**: Customizable CLI path and database configuration

### Technical Details

- Built with TypeScript for robust type safety
- VS Code API 1.102.0 compatibility
- ESLint integration for code quality
- Mocha test framework with comprehensive coverage
- Extension activation on SQL language detection
- Async/await implementation for smooth file editing operations
- Advanced text parsing for SQL statement boundary detection