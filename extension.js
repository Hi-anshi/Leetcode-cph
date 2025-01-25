const vscode = require("vscode");
const fetchTestCases = require("./src/fetchQuestion");
const addTestCase = require("./src/addTestCase");
const runTestCases = require("./src/runTestCases");
const createSolutionFile = require("./src/createSolutionFile");
const SidebarProvider = require("./src/SidebarProvider");


function activate(context) {
  console.log("CPH extension is now active!");

  // Register Fetch Test Cases Command
  const fetchCommand = vscode.commands.registerCommand("cph.fetchTestCases", async () => {
    const url = await vscode.window.showInputBox({
      prompt: "Enter the LeetCode problem URL",
    });

    if (url) {
      try {
        await fetchTestCases(url);
        vscode.window.showInformationMessage("Test cases fetched successfully!");
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch test cases: ${error.message}`);
      }
    } else {
      vscode.window.showWarningMessage("LeetCode URL is required to fetch test cases.");
    }
  });

  // Register Add Test Case Command
  const addCommand = vscode.commands.registerCommand("cph.addTestCase", async () => {
    try {
      await addTestCase();
      vscode.window.showInformationMessage("Test case added successfully!");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add test case: ${error.message}`);
    }
  });

  // Register Run Test Cases Command
  const runCommand = vscode.commands.registerCommand("cph.runTestCases", async () => {
    try {
      await runTestCases();
      vscode.window.showInformationMessage("Test cases executed successfully!");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to execute test cases: ${error.message}`);
    }
  });

  // Register Create Solution File Command
const createCommand = vscode.commands.registerCommand("cph.createSolutionFile", async () => {
    try {
      await createSolutionFile();
      vscode.window.showInformationMessage("Solution file created successfully!");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create solution file: ${error.message}`);
    }
  });

  const sidebarProvider = new SidebarProvider(context);
context.subscriptions.push(
  vscode.window.registerWebviewViewProvider("cph-sidebar", sidebarProvider)
);

  context.subscriptions.push(fetchCommand, addCommand, runCommand, createCommand);
}

function deactivate() {
  console.log("CPH extension is now deactivated.");
}

module.exports = {
  activate,
  deactivate,
};
