const fs = require("fs").promises;
const path = require("path");
const vscode = require("vscode");

const templates = {
    "JavaScript": `
// Write your solution here
function solution(nums, target) {
    const map = new Map();
    for(let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if(map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

module.exports = solution;`,

    "Python": `
# Write your solution here
def solution(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,

    "C++": `
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        unordered_map<int, int> map;
        for(int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if(map.count(complement)) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,

    "Java": `
import java.util.*;

class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> map = new HashMap<>();
        for(int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if(map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`
};

async function createSolutionFile() {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error("Please open a workspace first");
        }

        // Get language selection
        const language = await vscode.window.showQuickPick(Object.keys(templates), {
            placeHolder: "Select programming language"
        });
        if (!language) return;

        // Create solutions directory
        const solutionsDir = path.join(workspaceFolder.uri.fsPath, 'solutions');
        await fs.mkdir(solutionsDir, { recursive: true });

        // Create solution file
        const extension = language.toLowerCase() === "javascript" ? "js" : 
                         language.toLowerCase() === "python" ? "py" :
                         language.toLowerCase() === "c++" ? "cpp" : "java";
        
        const solutionPath = path.join(solutionsDir, `solution.${extension}`);
        await fs.writeFile(solutionPath, templates[language]);

        // Open file in editor
        const doc = await vscode.workspace.openTextDocument(solutionPath);
        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage(`Created solution file in ${language}`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create solution: ${error.message}`);
    }
}

module.exports = createSolutionFile;