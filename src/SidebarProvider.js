const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

class SidebarProvider {
  constructor(context) {
    this._context = context;
    this._view = null;
  }

  resolveWebviewView(webviewView, _context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._context.extensionPath, 'media'))
      ]
    };

    webviewView.webview.html = this._getWebviewContent(webviewView.webview);

    // Listen for messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "fetchTestCases":
          vscode.commands.executeCommand("cph.fetchTestCases");
          break;
        case "addTestCase":
          vscode.commands.executeCommand("cph.addTestCase");
          break;
        case "runTestCases":
          vscode.commands.executeCommand("cph.runTestCases");
          break;
        case "createSolutionFile":
          vscode.commands.executeCommand("cph.createSolutionFile");
          break;
        default:
          vscode.window.showErrorMessage("Unknown command received from sidebar.");
      }
    });
  }

  _getWebviewContent(webview) {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._context.extensionPath, "media", "style.css"))
    );

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>CPH Sidebar</title>
      </head>
      <body>
        <h1>CPH Extension</h1>
        <button onclick="sendCommand('fetchTestCases')">Fetch Test Cases</button>
        <button onclick="sendCommand('addTestCase')">Add Test Case</button>
        <button onclick="sendCommand('runTestCases')">Run Test Cases</button>
        <button onclick="sendCommand('createSolutionFile')">Create Solution File</button>
        <script>
          const vscode = acquireVsCodeApi();
          function sendCommand(command) {
            vscode.postMessage({ command });
          }
        </script>
      </body>
      </html>
    `;
  }
}

module.exports = SidebarProvider;
