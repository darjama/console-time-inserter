// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { start } from 'repl';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "console-time-inserter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('console-time-inserter.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from console-time-inserter!');
	});
	let inserter = vscode.commands.registerTextEditorCommand('console-time-inserter.insert', async () => {
		try {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				throw new Error('no editor found');
			}
			let selection = editor.selection;
			const userResponse = await vscode.window.showInputBox({
				placeHolder: 'enter label for console.time (no quotes)'
			});
			if (userResponse === undefined) {
				return;
			}
			if (selection.start.line !== selection.end.line && selection.end.character === 0) {
				selection = new vscode.Selection(selection.start.line, selection.start.character, selection.end.line - 1, 0);
			}
			editor.edit(editBuilder => {
				editBuilder.insert(editor.document.lineAt(selection.end.line).range.end, `\nconsole.timeEnd("${userResponse}")`);
				editBuilder.insert(editor.document.lineAt(selection.start.line).range.start, `console.time("${userResponse}")\n`);
				selection.start.translate(1);
		});
			vscode.window.showInformationMessage(JSON.stringify(selection) ?? '');
		} catch(err) {
			vscode.window.showInformationMessage(`console-time-inserter error: ${(err as Error).message}`);
		}
});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
