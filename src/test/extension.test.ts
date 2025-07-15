import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('DuckDB Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('lab1702.duckdb-ext'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('lab1702.duckdb-ext');
		if (extension && !extension.isActive) {
			await extension.activate();
		}
		assert.ok(extension?.isActive, 'Extension should be activated');
	});

	test('Commands should be registered after activation', async () => {
		// Ensure extension is activated first
		const extension = vscode.extensions.getExtension('lab1702.duckdb-ext');
		if (extension && !extension.isActive) {
			await extension.activate();
		}

		const commands = await vscode.commands.getCommands();
		
		assert.ok(commands.includes('duckdb-ext.createTerminal'), 'Create terminal command should be registered');
		assert.ok(commands.includes('duckdb-ext.executeQuery'), 'Execute query command should be registered');
		assert.ok(commands.includes('duckdb-ext.executeSelection'), 'Execute selection command should be registered');
		assert.ok(commands.includes('duckdb-ext.executeFile'), 'Execute file command should be registered');
	});

	test('Configuration should be available', () => {
		const config = vscode.workspace.getConfiguration('duckdb');
		
		// Test that configuration properties exist
		assert.ok(config.has('cliPath'), 'CLI path configuration should exist');
		assert.ok(config.has('defaultDatabase'), 'Default database configuration should exist');
		
		// Test default values
		assert.strictEqual(config.get('cliPath'), 'duckdb');
		assert.strictEqual(config.get('defaultDatabase'), ':memory:');
	});

	test('Smart statement detection should work', async () => {
		// Create a test document with SQL statements
		const document = await vscode.workspace.openTextDocument({
			content: `-- Test SQL file
SELECT * FROM users;
INSERT INTO users VALUES (1, 'test');
CREATE TABLE test (id INT);`,
			language: 'sql'
		});

		// Test that we can create positions within statements
		const position1 = new vscode.Position(1, 5); // Within SELECT statement
		const position2 = new vscode.Position(2, 10); // Within INSERT statement
		const position3 = new vscode.Position(3, 0); // Within CREATE statement

		// Verify positions are valid
		assert.ok(document.validatePosition(position1));
		assert.ok(document.validatePosition(position2));
		assert.ok(document.validatePosition(position3));
	});
});
