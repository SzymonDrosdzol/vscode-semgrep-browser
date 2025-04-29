import * as vscode from 'vscode';
import { handleOpenSemgrepJson, handleStartSemgrepView } from './views/semgrepExplorer';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('semgrep-browser.readSemgrepJson', () => handleOpenSemgrepJson(context)));
	context.subscriptions.push(vscode.commands.registerCommand('semgrep-browser.startFindingsView', () => handleStartSemgrepView(context)));
}

export function deactivate() { }
