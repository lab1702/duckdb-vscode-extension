// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Global variable to keep track of the DuckDB terminal
let duckdbTerminal: vscode.Terminal | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('DuckDB extension is now active!');

	// Register command to create DuckDB terminal
	const createTerminalCommand = vscode.commands.registerCommand('duckdb-ext.createTerminal', () => {
		createDuckDBTerminal();
	});

	// Register command to execute query (handles both selection and current statement)
	const executeQueryCommand = vscode.commands.registerCommand('duckdb-ext.executeQuery', () => {
		executeQuery();
	});

	// Register command to execute selection specifically
	const executeSelectionCommand = vscode.commands.registerCommand('duckdb-ext.executeSelection', () => {
		executeSelection();
	});

	// Register command to execute entire file
	const executeFileCommand = vscode.commands.registerCommand('duckdb-ext.executeFile', () => {
		executeEntireFile();
	});

	// Add commands to subscriptions
	context.subscriptions.push(createTerminalCommand, executeQueryCommand, executeSelectionCommand, executeFileCommand);

	// Listen for terminal disposal to clean up our reference
	vscode.window.onDidCloseTerminal((terminal) => {
		if (terminal === duckdbTerminal) {
			duckdbTerminal = undefined;
		}
	});
}

/**
 * Creates a new DuckDB terminal session
 */
function createDuckDBTerminal(): void {
	const config = vscode.workspace.getConfiguration('duckdb');
	const cliPath = config.get<string>('cliPath', 'duckdb');
	const defaultDatabase = config.get<string>('defaultDatabase', ':memory:');

	// Close existing terminal if it exists
	if (duckdbTerminal) {
		duckdbTerminal.dispose();
	}

	// Create new terminal
	duckdbTerminal = vscode.window.createTerminal({
		name: 'DuckDB CLI',
		shellPath: cliPath,
		shellArgs: [defaultDatabase]
	});

	// Show the terminal
	duckdbTerminal.show();

	vscode.window.showInformationMessage('DuckDB terminal session created!');
}

/**
 * Executes SQL query - either selection or current statement (no fallback to entire file)
 */
async function executeQuery(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found');
		return;
	}

	// Check if we have a DuckDB terminal
	if (!duckdbTerminal) {
		vscode.window.showWarningMessage('No DuckDB terminal found. Creating one...');
		createDuckDBTerminal();
		// Wait a moment for terminal to be ready
		setTimeout(async () => await executeQueryInternal(editor), 1000);
		return;
	}

	await executeQueryInternal(editor);
}

/**
 * Executes the entire file content
 */
async function executeEntireFile(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found');
		return;
	}

	// Check if we have a DuckDB terminal
	if (!duckdbTerminal) {
		vscode.window.showWarningMessage('No DuckDB terminal found. Creating one...');
		createDuckDBTerminal();
		// Wait a moment for terminal to be ready
		setTimeout(async () => await executeEntireFileInternal(editor), 1000);
		return;
	}

	await executeEntireFileInternal(editor);
}

/**
 * Internal function to execute the entire file
 */
async function executeEntireFileInternal(editor: vscode.TextEditor): Promise<void> {
	const textToExecute = editor.document.getText().trim();
	
	if (!textToExecute) {
		vscode.window.showWarningMessage('File is empty - nothing to execute');
		return;
	}

	// Send to terminal
	if (duckdbTerminal) {
		// Show terminal to display output
		duckdbTerminal.show();
		duckdbTerminal.sendText(textToExecute);
		vscode.window.showInformationMessage('Entire file executed in DuckDB terminal');
		
		// Restore focus to the editor after a brief delay
		setTimeout(async () => {
			await vscode.window.showTextDocument(editor.document, {
				viewColumn: editor.viewColumn,
				preserveFocus: false,
				selection: editor.selection
			});
		}, 100);
	}
}

/**
 * Finds the SQL statement at the current cursor position
 * Statements are separated by semicolons
 */
function findStatementAtCursor(document: vscode.TextDocument, position: vscode.Position): string | null {
	const text = document.getText();
	const offset = document.offsetAt(position);
	
	// Find all statement boundaries (semicolons)
	const statements: { start: number; end: number; text: string }[] = [];
	
	// Split by semicolons but be smart about it
	const parts = text.split(';');
	let currentOffset = 0;
	
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();
		if (part.length > 0) {
			const start = currentOffset;
			const end = currentOffset + parts[i].length;
			
			statements.push({
				start: start,
				end: end + (i < parts.length - 1 ? 1 : 0), // Include semicolon except for last part
				text: part + (i < parts.length - 1 ? ';' : '')
			});
		}
		currentOffset += parts[i].length + 1; // +1 for the semicolon
	}
	
	// Find which statement contains the cursor
	for (const statement of statements) {
		if (offset >= statement.start && offset <= statement.end) {
			return statement.text.trim();
		}
	}
	
	// If no statement found with semicolon, try to find a logical statement around cursor
	// But only if the cursor is actually positioned within or at the start of content
	return findLogicalStatementAtCursor(document, position);
}

/**
 * Finds a logical SQL statement around the cursor when semicolon method fails
 * This handles cases where there might not be semicolons
 */
function findLogicalStatementAtCursor(document: vscode.TextDocument, position: vscode.Position): string | null {
	const currentLine = position.line;
	const totalLines = document.lineCount;
	
	// Check if cursor is on a completely empty line or only whitespace line
	const currentLineText = document.lineAt(currentLine).text;
	const cursorColumn = position.character;
	
	// If cursor is at the end of a line and the line is empty or only has whitespace after cursor
	if (cursorColumn >= currentLineText.trim().length && currentLineText.trim() === '') {
		// Check if there are any non-empty lines below this position
		let hasContentBelow = false;
		for (let line = currentLine + 1; line < totalLines; line++) {
			const lineText = document.lineAt(line).text.trim();
			if (lineText.length > 0 && !lineText.startsWith('--')) {
				hasContentBelow = true;
				break;
			}
		}
		
		// If no content below and we're on an empty line, don't find any statement
		if (!hasContentBelow) {
			return null;
		}
	}
	
	// Check if cursor is positioned after all content in the file
	const textFromCursor = document.getText(new vscode.Range(position, new vscode.Position(totalLines - 1, document.lineAt(totalLines - 1).text.length)));
	if (textFromCursor.trim() === '') {
		// Cursor is after all content, don't execute anything
		return null;
	}
	
	// Start from current line and expand up and down to find statement boundaries
	let startLine = currentLine;
	let endLine = currentLine;
	
	// Check if current line has any content that the cursor is within
	const currentLineContent = currentLineText.trim();
	if (currentLineContent.length > 0 && !currentLineContent.startsWith('--')) {
		// Cursor is on a line with content, proceed with statement detection
		
		// Expand upward to find start of statement
		while (startLine > 0) {
			const lineText = document.lineAt(startLine - 1).text.trim();
			if (lineText === '' || lineText.startsWith('--') || 
				lineText.toLowerCase().match(/^(select|insert|update|delete|create|drop|alter|with)/)) {
				break;
			}
			startLine--;
		}
		
		// Expand downward to find end of statement
		while (endLine < totalLines - 1) {
			const lineText = document.lineAt(endLine + 1).text.trim();
			if (lineText === '' || lineText.startsWith('--') || 
				lineText.toLowerCase().match(/^(select|insert|update|delete|create|drop|alter|with)/)) {
				break;
			}
			endLine++;
		}
		
		// Get the text from startLine to endLine
		const range = new vscode.Range(startLine, 0, endLine, document.lineAt(endLine).text.length);
		const statementText = document.getText(range).trim();
		
		// Additional check: make sure the cursor is actually within the statement bounds
		const statementStart = document.offsetAt(new vscode.Position(startLine, 0));
		const statementEnd = document.offsetAt(new vscode.Position(endLine, document.lineAt(endLine).text.length));
		const cursorOffset = document.offsetAt(position);
		
		if (cursorOffset >= statementStart && cursorOffset <= statementEnd && statementText.length > 0) {
			return statementText;
		}
	}
	
	return null;
}

/**
 * Internal function to execute the query (selection or current statement only)
 */
async function executeQueryInternal(editor: vscode.TextEditor): Promise<void> {
	let textToExecute: string;
	let executionMode: string;
	let shouldMoveCursor = false;
	const originalPosition = editor.selection.active;
	
	// Check if there's a selection
	const selection = editor.selection;
	if (!selection.isEmpty) {
		// Get selected text
		textToExecute = editor.document.getText(selection);
		executionMode = 'selection';
		// For selections, we don't move the cursor automatically
		shouldMoveCursor = false;
	} else {
		// Find statement at cursor position
		const statementAtCursor = findStatementAtCursor(editor.document, selection.active);
		
		if (statementAtCursor) {
			textToExecute = statementAtCursor;
			executionMode = 'statement';
			// Only move cursor if we found and will execute a statement
			shouldMoveCursor = true;
		} else {
			// No statement found - notify user and do nothing else
			vscode.window.showWarningMessage('No SQL statement found at cursor position. Use Ctrl+Shift+Enter to execute the entire file.');
			return; // Early exit - no execution, no cursor movement
		}
	}

	// Clean up the text
	textToExecute = textToExecute.trim();
	
	if (!textToExecute) {
		vscode.window.showWarningMessage('No SQL content found to execute');
		return; // Early exit - no execution, no cursor movement
	}

	// Send to terminal
	if (duckdbTerminal) {
		// Show terminal to display output but preserve editor reference
		duckdbTerminal.show();
		duckdbTerminal.sendText(textToExecute);
		
		// Show feedback based on execution mode
		let message: string;
		switch (executionMode) {
			case 'selection':
				message = 'Selected SQL executed in DuckDB terminal';
				break;
			case 'statement':
				message = 'Current SQL statement executed in DuckDB terminal';
				break;
			default:
				message = 'SQL executed in DuckDB terminal';
		}
		
		vscode.window.showInformationMessage(message);
		
		// Only move cursor if we executed a statement (not a selection)
		if (shouldMoveCursor && executionMode === 'statement') {
			await handleCursorMovementAfterStatementExecution(editor, originalPosition);
		}
		
		// Restore focus to the editor after a brief delay to allow terminal output to be visible
		setTimeout(async () => {
			await vscode.window.showTextDocument(editor.document, {
				viewColumn: editor.viewColumn,
				preserveFocus: false,
				selection: editor.selection
			});
		}, 100); // 100ms delay should be enough for the terminal to show the command
	}
}

/**
 * Handles cursor movement after executing a statement
 */
async function handleCursorMovementAfterStatementExecution(editor: vscode.TextEditor, originalPosition: vscode.Position): Promise<void> {
	const nextStatementPosition = findNextStatementPosition(editor.document, originalPosition);
	if (nextStatementPosition) {
		// Move cursor to next statement
		const newSelection = new vscode.Selection(nextStatementPosition, nextStatementPosition);
		editor.selection = newSelection;
		
		// Scroll to make the new position visible
		editor.revealRange(new vscode.Range(nextStatementPosition, nextStatementPosition), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
	} else {
		// No next statement found - this was the last statement
		// Move cursor to an empty line below the current statement
		await moveToEmptyLineAfterLastStatement(editor, originalPosition);
	}
}

/**
 * Executes only the current selection
 */
async function executeSelection(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	
	if (!editor) {
		vscode.window.showErrorMessage('No active editor found');
		return;
	}

	if (editor.selection.isEmpty) {
		vscode.window.showWarningMessage('No text selected');
		return;
	}

	// Check if we have a DuckDB terminal
	if (!duckdbTerminal) {
		vscode.window.showWarningMessage('No DuckDB terminal found. Creating one...');
		createDuckDBTerminal();
		// Wait a moment for terminal to be ready
		setTimeout(async () => await executeSelectionInternal(editor), 1000);
		return;
	}

	await executeSelectionInternal(editor);
}

/**
 * Internal function to execute selection
 */
async function executeSelectionInternal(editor: vscode.TextEditor): Promise<void> {
	const selection = editor.selection;
	const textToExecute = editor.document.getText(selection).trim();
	
	if (!textToExecute) {
		vscode.window.showWarningMessage('No text selected');
		return;
	}

	// Send to terminal
	if (duckdbTerminal) {
		// Show terminal to display output
		duckdbTerminal.show();
		duckdbTerminal.sendText(textToExecute);
		vscode.window.showInformationMessage('Selected SQL executed in DuckDB terminal');
		
		// Restore focus to the editor after a brief delay
		setTimeout(async () => {
			await vscode.window.showTextDocument(editor.document, {
				viewColumn: editor.viewColumn,
				preserveFocus: false,
				selection: editor.selection
			});
		}, 100);
	}
}

/**
 * Finds the next SQL statement after the current cursor position
 * Returns the position where the next statement starts, or null if none found
 */
function findNextStatementPosition(document: vscode.TextDocument, currentPosition: vscode.Position): vscode.Position | null {
	const text = document.getText();
	const cursorOffset = document.offsetAt(currentPosition);
	
	// Find the current statement's end position first
	const currentStatementEnd = findCurrentStatementEnd(document, currentPosition);
	if (currentStatementEnd === null) {
		return null;
	}
	
	// Now find the next statement that starts after the current statement ends
	const searchStartOffset = document.offsetAt(currentStatementEnd);
	
	// Find all statement boundaries (semicolons) after the current statement
	const remainingText = text.substring(searchStartOffset);
	const parts = remainingText.split(';');
	
	let offset = searchStartOffset;
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();
		if (part.length > 0) {
			// Find the actual start of this statement (skip whitespace and comments)
			const partStart = offset;
			const partText = text.substring(partStart, partStart + parts[i].length);
			
			// Find first non-whitespace, non-comment line in this part
			const lines = partText.split('\n');
			let lineOffset = partStart;
			
			for (const line of lines) {
				const trimmedLine = line.trim();
				if (trimmedLine.length > 0 && !trimmedLine.startsWith('--')) {
					const linePosition = document.positionAt(lineOffset + line.indexOf(trimmedLine));
					return linePosition;
				}
				lineOffset += line.length + 1; // +1 for newline
			}
		}
		offset += parts[i].length + 1; // +1 for semicolon
	}
	
	// If no semicolon-based statement found, try to find next logical statement
	return findNextLogicalStatementPosition(document, currentStatementEnd);
}

/**
 * Finds the end position of the current statement containing the cursor
 */
function findCurrentStatementEnd(document: vscode.TextDocument, position: vscode.Position): vscode.Position | null {
	const text = document.getText();
	const offset = document.offsetAt(position);
	
	// Find all statement boundaries (semicolons)
	const parts = text.split(';');
	let currentOffset = 0;
	
	for (let i = 0; i < parts.length; i++) {
		const start = currentOffset;
		const end = currentOffset + parts[i].length;
		
		// Check if cursor is within this statement
		if (offset >= start && offset <= end) {
			// Return position after the semicolon (or end of file for last statement)
			const endOffset = end + (i < parts.length - 1 ? 1 : 0); // +1 for semicolon
			return document.positionAt(endOffset);
		}
		
		currentOffset += parts[i].length + 1; // +1 for semicolon
	}
	
	return null;
}

/**
 * Finds the next logical SQL statement using line-based analysis
 * when semicolon method fails
 */
function findNextLogicalStatementPosition(document: vscode.TextDocument, currentPosition: vscode.Position): vscode.Position | null {
	const totalLines = document.lineCount;
	
	// Start searching from the line after current position
	for (let line = currentPosition.line + 1; line < totalLines; line++) {
		const lineText = document.lineAt(line).text.trim();
		
		// Look for SQL keywords that typically start new statements
		if (lineText.length > 0 && !lineText.startsWith('--') &&
			lineText.toLowerCase().match(/^(select|insert|update|delete|create|drop|alter|with)/)) {
			return new vscode.Position(line, document.lineAt(line).firstNonWhitespaceCharacterIndex);
		}
	}
	
	return null; // No next statement found
}

/**
 * Moves cursor to an empty line after the last statement in the file
 * This function should ONLY be called when we know a statement was found and executed
 */
async function moveToEmptyLineAfterLastStatement(editor: vscode.TextEditor, originalPosition: vscode.Position): Promise<void> {
	const currentStatementEnd = findCurrentStatementEnd(editor.document, originalPosition);
	if (!currentStatementEnd) {
		// Should not happen if we got here, but be safe
		return;
	}
	
	const document = editor.document;
	const statementEndLine = currentStatementEnd.line;
	const lastLineNumber = document.lineCount - 1;
	
	let targetPosition: vscode.Position;
	
	if (statementEndLine === lastLineNumber) {
		// Statement ends on the last line of the file
		const lastLine = document.lineAt(lastLineNumber);
		if (lastLine.text.trim() === '') {
			// Last line is already empty, just move cursor there
			targetPosition = new vscode.Position(lastLineNumber, 0);
		} else {
			// Add a new line after the statement
			const edit = new vscode.WorkspaceEdit();
			const insertPosition = new vscode.Position(lastLineNumber, lastLine.text.length);
			edit.insert(document.uri, insertPosition, '\n');
			await vscode.workspace.applyEdit(edit);
			
			// Move cursor to the new empty line
			targetPosition = new vscode.Position(lastLineNumber + 1, 0);
		}
	} else {
		// There are lines after the statement - check if the next line is empty
		const nextLineNumber = statementEndLine + 1;
		if (nextLineNumber < document.lineCount) {
			const nextLine = document.lineAt(nextLineNumber);
			if (nextLine.text.trim() === '') {
				// Next line is empty, move cursor there
				targetPosition = new vscode.Position(nextLineNumber, 0);
			} else {
				// Insert an empty line and move cursor there
				const edit = new vscode.WorkspaceEdit();
				const insertPosition = new vscode.Position(nextLineNumber, 0);
				edit.insert(document.uri, insertPosition, '\n');
				await vscode.workspace.applyEdit(edit);
				
				targetPosition = new vscode.Position(nextLineNumber, 0);
			}
		} else {
			// Should not reach here, but handle gracefully
			targetPosition = new vscode.Position(statementEndLine, document.lineAt(statementEndLine).text.length);
		}
	}
	
	// Move cursor to target position
	const newSelection = new vscode.Selection(targetPosition, targetPosition);
	editor.selection = newSelection;
	
	// Scroll to make the new position visible
	editor.revealRange(new vscode.Range(targetPosition, targetPosition), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (duckdbTerminal) {
		duckdbTerminal.dispose();
	}
}
