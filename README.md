# DuckDB Extension for VS Code

A Visual Studio Code extension that provides integration with DuckDB CLI, enabling database management and query execution directly from your editor.

## Quick Start

### Prerequisites

1. **Install DuckDB CLI**: Download from [https://duckdb.org/docs/installation/](https://duckdb.org/docs/installation/)
2. **Verify installation**: Run `duckdb --version` in your terminal

### Get Started in 2 Steps

1. **Open a SQL File**: Create a new file with `.sql` extension or open the provided `quick_start.sql`
2. **Execute SQL**: Use `Ctrl+Enter` to execute statements or `Ctrl+Shift+Enter` for entire file (DuckDB terminal will be created automatically if none exists)
3. **Optional - Open Database File**: Use `.open path/to/your/database.duckdb` for persistent data (default is in-memory)

### Example Workflow

```sql
-- Optional: Open a persistent database file (otherwise uses in-memory)
.open ./my_project.duckdb

-- Place cursor anywhere in this statement and press Ctrl+Enter
CREATE TABLE users (id INTEGER, name VARCHAR, age INTEGER);

-- Cursor automatically moves here - press Ctrl+Enter again
INSERT INTO users VALUES (1, 'Alice', 25), (2, 'Bob', 30);

-- Continue stepping through with Ctrl+Enter
SELECT * FROM users WHERE age > 25;
```

**Pro Tip**: Use `Ctrl+Enter` repeatedly to step through SQL files statement-by-statement with automatic cursor advancement!

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

### From GitHub Release (Recommended)

1. Go to the [Releases page](https://github.com/lab1702/duckdb-vscode-extension/releases)
2. Download the latest `.vsix` file from the release assets
3. In VS Code: `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
4. Select the downloaded `.vsix` file

### From GitHub Actions Build

1. Go to the [Actions tab](https://github.com/lab1702/duckdb-vscode-extension/actions)
2. Click on the latest successful "Build and Test Extension" workflow run
3. Download the `duckdb-extension-*` artifact
4. Extract the `.vsix` file and install it in VS Code

### From Source

1. Clone this repository:

   ```bash
   git clone https://github.com/lab1702/duckdb-vscode-extension.git
   cd duckdb-vscode-extension
   ```

2. Install dependencies and build:

   ```bash
   npm install
   npm run compile
   ```

3. Package the extension:

   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

4. Install the generated `.vsix` file in VS Code

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

- `duckdb.cliPath`: Path to the DuckDB CLI executable (default: "duckdb")
- `duckdb.defaultDatabase`: Default database to connect to (default: ":memory:")

## Commands

- `DuckDB: Create Terminal Session` - Manually create a new DuckDB CLI terminal (automatic creation also available)
- `DuckDB: Execute Query (Smart Detection)` - Execute selected text or current statement (`Ctrl+Enter`)
- `DuckDB: Execute Selection` - Execute only the selected SQL text
- `DuckDB: Execute Entire File` - Execute the entire file content (`Ctrl+Shift+Enter`)

## Keyboard Shortcuts

- `Ctrl+Enter` - Execute SQL query (selection or current statement in .sql files)
- `Ctrl+Shift+Enter` - Execute entire file content (.sql files)

## Usage

### 1. Execute SQL Queries - Three Execution Modes

The extension automatically creates a DuckDB terminal when you first execute a query if none exists.

#### Smart Execution with `Ctrl+Enter`

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

#### File Execution with `Ctrl+Shift+Enter`

- Press `Ctrl+Shift+Enter` to execute the entire file content at once
- Use this for running complete SQL scripts or when you want to execute everything

### 2. Workflow Examples

- **Development**: Use `Ctrl+Enter` to test individual statements as you write them
- **Debugging**: Place cursor in problematic statement and press `Ctrl+Enter` to test it alone
- **Code Review**: Step through SQL files statement-by-statement with repeated `Ctrl+Enter`
- **Deployment**: Use `Ctrl+Shift+Enter` to run entire migration or setup scripts

### 3. Configuration

- Go to VS Code Settings (`Ctrl+,`)
- Search for "DuckDB"
- Configure CLI path and default database as needed

### 4. Working with DuckDB Files

By default, the extension opens DuckDB in **in-memory mode** (`:memory:`), which means data is temporary and lost when the session ends. To work with persistent DuckDB files:

#### Opening Existing DuckDB Files

Use the `.open` command in the DuckDB terminal:

```sql
-- Open an existing DuckDB file
.open path/to/your/database.duckdb

-- Open a file read-only
.open --readonly path/to/your/database.duckdb

-- Create a new empty database file
.open --new path/to/new/database.duckdb

-- Open without following symbolic links
.open --nofollow path/to/your/database.duckdb
```

#### Examples

```sql
-- Open a local database file
.open ./my_project.duckdb

-- Open with full path (Windows)
.open C:\Users\YourName\Documents\data.duckdb

-- Open with full path (Linux/macOS)
.open /home/username/data/analytics.duckdb

-- Open read-only for safety
.open --readonly ./important_data.duckdb
```

#### Configuration Alternative

You can also set a default database file in VS Code settings:

1. Open VS Code Settings (`Ctrl+,`)
2. Search for "DuckDB"
3. Set `duckdb.defaultDatabase` to your file path instead of `:memory:`
4. Example: `./my_database.duckdb` or `/full/path/to/database.duckdb`

**Note**: When you set a default database in settings, new terminal sessions will automatically open that file.

#### Manual Terminal Creation (Optional)

While the extension automatically creates terminals when needed, you can also create them manually:

- Open Command Palette (`Ctrl+Shift+P`)
- Run "DuckDB: Create Terminal Session"
- A new terminal with DuckDB CLI will open

### Tips for Best Results

- **Statement boundaries**: Statements are detected by semicolons (`;`) - ensure your SQL is properly formatted
- **Multi-line statements**: Complex statements spanning multiple lines are fully supported
- **Comments**: Comments are included when executing but ignored by DuckDB
- **Terminal management**: Extension automatically creates a new terminal if none exists
- **Workflow efficiency**: Use `Ctrl+Enter` repeatedly to step through an entire SQL file statement by statement
- **Persistent data**: Use `.open filename.duckdb` to work with persistent database files instead of in-memory databases
- **File paths**: Use forward slashes (`/`) or double backslashes (`\\`) in file paths on Windows for compatibility

### Troubleshooting

**DuckDB command not found**:

- Ensure DuckDB is installed and in your PATH
- Configure custom path in extension settings

**Terminal not responding**:

- Close the DuckDB terminal and create a new one
- Use Command Palette → "DuckDB: Create Terminal Session"

**Extension not working**:

- Ensure you're working with `.sql` files
- Check that the extension is activated (should show "DuckDB extension is now active!" in output)

**Cannot open database file**:

- Check that the file path is correct and accessible
- Ensure you have read/write permissions for the file and directory
- Use forward slashes or escaped backslashes in file paths on Windows
- Example: `.open C:/Users/YourName/data.duckdb` or `.open C:\\Users\\YourName\\data.duckdb`

**Data not persisting**:

- By default, DuckDB runs in memory mode (`:memory:`)
- Use `.open filename.duckdb` to create/open a persistent database file
- Or configure `duckdb.defaultDatabase` setting to a file path

## Known Issues

- Statement detection works best with properly formatted SQL (each statement ending with `;`)
- Complex nested statements or stored procedures may require manual selection
- Extension requires DuckDB CLI to be installed and accessible in PATH (or configured in settings)

## Release Notes

### 0.0.4 - Latest

- **Enhanced Documentation**: Comprehensive documentation consolidation and file organization
- **Code Quality Improvements**: Applied best practices, error handling, and maintainability enhancements
- **Simplified User Experience**: Reduced quick start steps and improved onboarding process
- **File Consolidation**: Eliminated redundant files and improved project structure

### 0.0.3

- Fixed cursor position behavior to prevent re-execution of last statement
- Improved statement detection logic and boundary validation
- Enhanced user experience with better cursor positioning

### 0.0.2

- Fixed focus management to return to editor after query execution
- Improved seamless statement-by-statement execution workflow

### 0.0.1 - Initial Release

Complete DuckDB VS Code integration featuring:

- Smart SQL statement execution with `Ctrl+Enter`
- Separate file execution with `Ctrl+Shift+Enter`
- Automatic DuckDB terminal management
- Intelligent statement detection and parsing
- Comprehensive error handling and user feedback
- Full TypeScript implementation with testing

For detailed changes, see [CHANGELOG.md](CHANGELOG.md).

## Automated Builds

This extension uses GitHub Actions for automated building and releasing:

- **Every push to main**: Builds and tests the extension, uploads VSIX as artifact
- **Every release**: Automatically builds, tests, packages, and attaches VSIX to the release
- **Quality assurance**: All releases are automatically tested before packaging

See [RELEASE.md](RELEASE.md) for detailed release process documentation.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Extension Guidelines

This extension follows the VS Code extension guidelines:

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## For More Information

- [VS Code Extension API](https://code.visualstudio.com/api)
- [DuckDB Documentation](https://duckdb.org/docs/)
- [VS Code Extension Development](https://code.visualstudio.com/api/get-started/your-first-extension)

**Enjoy building with DuckDB and VS Code!**
