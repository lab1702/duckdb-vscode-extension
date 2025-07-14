# DuckDB Extension for VS Code

A Visual Studio Code extension that provides integration with DuckDB CLI, enabling database management and query execution directly from your editor.

## Features

- **DuckDB Terminal Integration**: Create and manage DuckDB CLI terminal sessions directly from VS Code
- **Smart Query Execution**: Execute SQL queries with precise control:
  - **Selection Mode** (`Ctrl+Enter`): Execute only the highlighted/selected SQL text
  - **Statement Mode** (`Ctrl+Enter`): If no text is selected, execute the SQL statement where the cursor is positioned
  - **Full File Mode** (`Ctrl+Shift+Enter`): Execute the entire file content
- **Intelligent Navigation**: After executing a statement with `Ctrl+Enter`, the cursor automatically moves to the beginning of the next statement for seamless workflow. When executing the last statement, the cursor moves to an empty line below it (inserting a newline if needed) to prevent accidental re-execution
- **Safety First**: `Ctrl+Enter` will notify you if no statement is found at cursor position (prevents unwanted full-file execution)
- **Automatic Statement Detection**: Intelligently finds SQL statements separated by semicolons (`;`)
- **Automatic Terminal Management**: Automatically creates DuckDB terminal if none exists
- **Editor Focus Management**: Automatically returns focus to the editor after query execution for efficient workflow
- **Configurable Settings**: Customize DuckDB CLI path and default database
- **SQL File Support**: Optimized for `.sql` files with appropriate keyboard shortcuts

> Execute SQL with precision: select text for targeted execution, use `Ctrl+Enter` to intelligently execute statements and auto-advance through your file, or run everything with `Ctrl+Shift+Enter`.

## Requirements

- **Node.js 20.x** or higher
- **DuckDB CLI** installed on your system ([Download here](https://duckdb.org/docs/installation/))
- **VS Code 1.102.0** or higher

### Installing DuckDB CLI

**Linux/macOS:**
```bash
# Download and install DuckDB
wget https://github.com/duckdb/duckdb/releases/latest/download/duckdb_cli-linux-amd64.zip
unzip duckdb_cli-linux-amd64.zip
sudo mv duckdb /usr/local/bin/
```

**Windows:**
```bash
# Using winget (recommended)
winget install duckdb.cli

# Or download from https://duckdb.org/docs/installation/
# Or use chocolatey: choco install duckdb
```

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Open the project in VS Code
4. Press `F5` to launch the Extension Development Host

## Development

### Building the Extension

```bash
npm run compile
```

### Running Tests

```bash
npm test
```

### Watching for Changes

```bash
npm run watch
```

### Debugging

1. Open the project in VS Code
2. Press `F5` to start debugging
3. A new Extension Development Host window will open
4. Test your extension commands with `Ctrl+Shift+P`

## Extension Settings

This extension contributes the following settings:

* `duckdb.cliPath`: Path to the DuckDB CLI executable (default: "duckdb")
* `duckdb.defaultDatabase`: Default database to connect to (default: ":memory:")

## Commands

- `DuckDB: Create Terminal Session` - Create a new DuckDB CLI terminal
- `DuckDB: Execute Query (Smart Detection)` - Execute selected text or current statement (`Ctrl+Enter`)
- `DuckDB: Execute Selection` - Execute only the selected SQL text
- `DuckDB: Execute Entire File` - Execute the entire file content (`Ctrl+Shift+Enter`)

## Keyboard Shortcuts

- `Ctrl+Enter` - Execute SQL query (selection or current statement in .sql files)
- `Ctrl+Shift+Enter` - Execute entire file content (.sql files)

## Usage

1. **Create a DuckDB Terminal**:
   - Open Command Palette (`Ctrl+Shift+P`)
   - Run "DuckDB: Create Terminal Session"
   - A new terminal with DuckDB CLI will open

2. **Execute SQL Queries** - Three distinct modes:

   ### Smart Execution with `Ctrl+Enter`
   The extension intelligently determines what to execute:
   
   - **Selection Mode**: If text is selected, execute only the selected text
   - **Statement Mode**: If no text is selected, automatically find and execute the complete SQL statement where your cursor is positioned
   - **Safety**: If no statement is found at cursor position, shows a warning message (no unwanted execution)
   
   **Statement-by-Statement Workflow**:
   - Place cursor anywhere within a SQL statement and press `Ctrl+Enter`
   - The statement executes and cursor automatically moves to the beginning of the next statement
   - Press `Ctrl+Enter` again to execute the next statement
   - Continue this pattern to step through your entire SQL file
   - When you reach the last statement, cursor moves to an empty line below it (inserting a newline if needed) to prevent accidental re-execution

   ### File Execution with `Ctrl+Shift+Enter`
   - Press `Ctrl+Shift+Enter` to execute the entire file content at once
   - Use this for running complete SQL scripts or when you want to execute everything

3. **Workflow Examples**:
   - **Development**: Use `Ctrl+Enter` to test individual statements as you write them
   - **Debugging**: Place cursor in problematic statement and press `Ctrl+Enter` to test it alone
   - **Code Review**: Step through SQL files statement-by-statement with repeated `Ctrl+Enter`
   - **Deployment**: Use `Ctrl+Shift+Enter` to run entire migration or setup scripts

4. **Configuration**:
   - Go to VS Code Settings (`Ctrl+,`)
   - Search for "DuckDB"
   - Configure CLI path and default database as needed

## Known Issues

- Statement detection works best with properly formatted SQL (each statement ending with `;`)
- Complex nested statements or stored procedures may require manual selection
- Extension requires DuckDB CLI to be installed and accessible in PATH (or configured in settings)

## Release Notes

### 0.0.1

Complete DuckDB VS Code integration featuring:
- Smart SQL statement execution with `Ctrl+Enter`
- Separate file execution with `Ctrl+Shift+Enter`
- Automatic DuckDB terminal management
- Intelligent statement detection and parsing
- Comprehensive error handling and user feedback
- Full TypeScript implementation with testing

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Extension Guidelines

This extension follows the VS Code extension guidelines:
* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## For More Information

* [VS Code Extension API](https://code.visualstudio.com/api)
* [DuckDB Documentation](https://duckdb.org/docs/)
* [VS Code Extension Development](https://code.visualstudio.com/api/get-started/your-first-extension)

**Enjoy building with DuckDB and VS Code!**
