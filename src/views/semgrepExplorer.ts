import * as vscode from 'vscode';
import { parseSemgrep } from '../semgrep/semgrepParser';
import { ReactPanel } from './reactPanel';

export async function handleOpenSemgrepJson(context: vscode.ExtensionContext) {
  ReactPanel.createOrShow(context.extensionPath);
  let jsonFile = await chooseJsonFile();
  if(!jsonFile) return;
  let jsonParsed = await parseSemgrep(jsonFile?.fsPath);
  let webview = await ReactPanel.currentPanel?.getWebviewPromise();

  webview?.postMessage({ action: "setFindings", data: jsonParsed });
}

export async function handleStartSemgrepView(context: vscode.ExtensionContext) {
  ReactPanel.createOrShow(context.extensionPath);
}

async function chooseJsonFile(): Promise<vscode.Uri | undefined> {
  return vscode.window.showOpenDialog({
    openLabel: "Choose Semgrep result",
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: { JsonFiles: ['json', 'txt'] }
  })
    .then((chosen) => chosen && chosen?.length > 0 ? chosen[0] : undefined);
}