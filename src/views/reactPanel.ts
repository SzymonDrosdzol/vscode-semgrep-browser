import * as vscode from 'vscode';
import * as path from 'path';

export class ReactPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: ReactPanel | undefined;

    private static readonly viewType = 'react';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;
    private _disposables: vscode.Disposable[] = [];
    private _webviewPromise: Promise<vscode.Webview>;

    public static createOrShow(extensionPath: string) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        // Otherwise, create a new panel.
        if (ReactPanel.currentPanel) {
            ReactPanel.currentPanel._panel.reveal(column);
        } else {
            ReactPanel.currentPanel = new ReactPanel(extensionPath, column || vscode.ViewColumn.One);
        }
    }

    private constructor(extensionPath: string, column: vscode.ViewColumn) {
        this._extensionPath = extensionPath;

        // Create and show a new webview panel
        this._panel = vscode.window.createWebviewPanel(ReactPanel.viewType, "Semgrep Explorer", column, {
            // Enable javascript in the webview
            enableScripts: true,

            // And restric the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.file(path.join(this._extensionPath, 'out', 'views', 'browserPanel'))
            ]
        });

        this._webviewPromise = new Promise<vscode.Webview>((resolve, reject) => {
            // Handle messages from the webview
            this._panel.webview.onDidReceiveMessage(message => {
                switch (message.command) {
                    case 'open':
                        vscode.commands.executeCommand("semgrep-browser.readSemgrepJson");
                        return;
                    case 'ready':
                        resolve(this._panel.webview);
                }
            }, null, this._disposables);
        });

        // Set the webview's initial html content 
        this._panel.webview.html = this._getHtmlForWebview();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public dispose() {
        ReactPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    public getWebview(): vscode.Webview { return this._panel.webview }

    public getWebviewPromise(): Promise<vscode.Webview> { return this._webviewPromise; }

    private _getHtmlForWebview() {
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'out', 'views', 'browserPanel', 'bundle.js'));
        const scriptUri = this.getWebview().asWebviewUri(scriptPathOnDisk);
        const stylePathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'out', 'views', 'browserPanel', 'app.css'));
        const styleUri = this.getWebview().asWebviewUri(stylePathOnDisk);

        // Use a nonce to whitelist which scripts can be run
        const nonce = ReactPanel.getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>Semgrep Explorer</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data: file:;">
                <base href="${vscode.Uri.file(path.join(this._extensionPath, 'out')).with({ scheme: 'vscode-webview' })}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script Type="Module" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }

    private static getNonce(): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
