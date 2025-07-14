# DuckDB Extension Quick Start Guide

This guide will help you get started with the DuckDB VS Code extension.

## Prerequisites

1. **Install DuckDB CLI**: Download from [https://duckdb.org/docs/installation/](https://duckdb.org/docs/installation/)
2. **Verify installation**: Run `duckdb --version` in your terminal

## Quick Start

### 1. Open a SQL File
- Create a new file with `.sql` extension
- Or open the provided `sample.sql`

### 2. Create DuckDB Terminal
- Press `Ctrl+Shift+P` to open Command Palette
- Type "DuckDB: Create Terminal Session" and press Enter
- A new terminal will open with DuckDB CLI running

### 3. Execute SQL Queries

#### Smart Statement Execution (`Ctrl+Enter`)
The extension intelligently detects what to execute:

**Option A: Execute Selected Text**
1. Highlight any SQL statement(s) or text
2. Press `Ctrl+Enter`
3. Only the selected text will be sent to DuckDB terminal

**Option B: Execute Current Statement**
1. Place cursor anywhere within a SQL statement (no selection)
2. Press `Ctrl+Enter`
3. The complete statement where your cursor is located will be executed
4. **Smart Navigation**: Cursor automatically moves to the beginning of the next statement
5. For the last statement, cursor moves to an empty line below it (to prevent re-execution)

**Option C: Execute Entire File (`Ctrl+Shift+Enter`)**
1. Press `Ctrl+Shift+Enter` (regardless of cursor position or selection)
2. The entire file content will be sent to DuckDB terminal

#### Safety Features
- If `Ctrl+Enter` can't find a statement at cursor position, you'll get a warning (no accidental file execution)
- Clear separation between statement execution and file execution prevents mistakes

## Example Workflow

1. **Open** `sample.sql`
2. **Create terminal** using Command Palette → "DuckDB: Create Terminal Session"
3. **Step through statements**: 
   - Place cursor in the `CREATE TABLE users` statement and press `Ctrl+Enter`
   - Cursor automatically moves to next statement
   - Press `Ctrl+Enter` again to execute the `INSERT INTO users` statement
   - Continue with `Ctrl+Enter` to step through each query
4. **Execute specific queries**: Highlight any `SELECT` statement and press `Ctrl+Enter`
5. **Run entire script**: Press `Ctrl+Shift+Enter` to execute everything at once

## Tips

- **Statement boundaries**: Statements are detected by semicolons (`;`) - ensure your SQL is properly formatted
- **Multi-line statements**: Complex statements spanning multiple lines are fully supported
- **Comments**: Comments are included when executing but ignored by DuckDB
- **Terminal management**: Extension automatically creates a new terminal if none exists
- **Workflow efficiency**: Use `Ctrl+Enter` repeatedly to step through an entire SQL file statement by statement

## Configuration

Access settings via `File → Preferences → Settings` and search for "DuckDB":

- **DuckDB CLI Path**: Set custom path to DuckDB executable
- **Default Database**: Change from `:memory:` to a file path for persistent storage

## Troubleshooting

**DuckDB command not found**: 
- Ensure DuckDB is installed and in your PATH
- Configure custom path in extension settings

**Terminal not responding**:
- Close the DuckDB terminal and create a new one
- Use Command Palette → "DuckDB: Create Terminal Session"

**Extension not working**:
- Ensure you're working with `.sql` files
- Check that the extension is activated (should show "DuckDB extension is now active!" in output)

## Next Steps

- Explore the `examples/advanced_queries.sql` file for more complex examples
- Create your own SQL files and databases
- Configure persistent databases by setting a file path instead of `:memory:`
- Use DuckDB's powerful analytical capabilities with your data

Happy querying! 🦆
