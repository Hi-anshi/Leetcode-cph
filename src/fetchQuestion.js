const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const vscode = require("vscode");

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const FETCH_PROBLEM_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      content
      sampleTestCase
      exampleTestcases
      codeSnippets {
        lang
        langSlug
        code
      }
    }
  }
`;

function getTitleSlug(url) {
    const match = url.match(/leetcode\.com\/problems\/([\w-]+)\/?/);
    if (!match) throw new Error("Invalid LeetCode problem URL.");
    return match[1];
}

async function fetchTestCases(url) {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error("No workspace folder found");
        }

        const titleSlug = getTitleSlug(url);

        // Fetch problem data from LeetCode
        const response = await axios.post(LEETCODE_GRAPHQL_ENDPOINT, {
            query: FETCH_PROBLEM_QUERY,
            variables: { titleSlug },
        });

        const problemData = response.data.data.question;
        if (!problemData) throw new Error("Problem data not found.");

        // Create test cases directory in workspace
        const testCasesDir = path.join(workspaceFolder.uri.fsPath, 'testCases', titleSlug);
        await fs.mkdir(testCasesDir, { recursive: true });

        // Parse and save test cases
        const testCases = problemData.exampleTestcases.split('\n').filter(line => line.trim());
        
        // Save input and expected output
        for (let i = 0; i < testCases.length; i += 2) {
            const input = testCases[i];
            const output = testCases[i + 1] || '';

            await fs.writeFile(path.join(testCasesDir, `input_${(i/2)+1}.txt`), input);
            await fs.writeFile(path.join(testCasesDir, `output_${(i/2)+1}.txt`), output);
        }

        // Also create solutions directory
        const solutionsDir = path.join(workspaceFolder.uri.fsPath, 'solutions');
        await fs.mkdir(solutionsDir, { recursive: true });

        vscode.window.showInformationMessage(`Test cases saved for: ${titleSlug}`);
        return testCasesDir;

    } catch (error) {
        console.error('Error:', error);
        throw new Error(`Failed to fetch test cases: ${error.message}`);
    }
}

module.exports = fetchTestCases;

// Example usage
// Replace with a valid LeetCode problem URL
// fetchTestCases("https://leetcode.com/problems/two-sum/");
