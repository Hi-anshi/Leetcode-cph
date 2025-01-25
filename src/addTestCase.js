const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

const TEST_CASES_PATH = path.join(__dirname, "test_cases");

async function addTestCase() {
  try {
    const problemFolders = fs.readdirSync(TEST_CASES_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    if (problemFolders.length === 0) {
      throw new Error("No problems found. Fetch a problem before adding test cases.");
    }

    const problem = await vscode.window.showQuickPick(problemFolders, {
      placeHolder: "Select the problem to add test cases to",
    });

    if (!problem) {
      vscode.window.showWarningMessage("No problem selected.");
      return;
    }

    const input = await vscode.window.showInputBox({
      prompt: "Enter the input for the test case",
      validateInput: (value) => (value.trim() === "" ? "Input cannot be empty" : null),
    });

    if (!input) {
      vscode.window.showWarningMessage("Test case input is required.");
      return;
    }

    const expectedOutput = await vscode.window.showInputBox({
      prompt: "Enter the expected output for the test case",
      validateInput: (value) => (value.trim() === "" ? "Expected output cannot be empty" : null),
    });

    if (!expectedOutput) {
      vscode.window.showWarningMessage("Test case expected output is required.");
      return;
    }

    const problemPath = path.join(TEST_CASES_PATH, problem);
    const existingInputs = fs.readdirSync(problemPath).filter((file) => file.startsWith("input_"));
    const nextIndex = existingInputs.length + 1;

    const inputFile = path.join(problemPath, `input_${nextIndex}.txt`);
    const outputFile = path.join(problemPath, `output_${nextIndex}.txt`);

    fs.writeFileSync(inputFile, input.trim());
    fs.writeFileSync(outputFile, expectedOutput.trim());

    vscode.window.showInformationMessage(`Test case ${nextIndex} added successfully to ${problem}!`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to add test case: ${error.message}`);
  }
}

module.exports = addTestCase;
