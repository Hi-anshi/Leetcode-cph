const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

const languageConfig = {
    "JavaScript": {
        extension: "js",
        runCommand: (filepath) => `node "${filepath}"`,
        template: `
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    // Write your solution here
}

// Read input and process
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let inputLines = [];
rl.on('line', (line) => {
    inputLines.push(line);
});

rl.on('close', () => {
    const nums = JSON.parse(inputLines[0]);
    const target = parseInt(inputLines[1]);
    const result = solution(nums, target);
    console.log(JSON.stringify(result));
});`
    },
    "Python": {
        extension: "py",
        runCommand: (filepath) => `python3 "${filepath}"`,
        template: `
def solution(nums, target):
    # Write your solution here
    pass

if __name__ == '__main__':
    import sys
    import json
    lines = sys.stdin.readlines()
    nums = json.loads(lines[0])
    target = int(lines[1])
    result = solution(nums, target)
    print(json.dumps(result))`
    },
    "C++": {
        extension: "cpp",
        runCommand: (file) => `clang++ -std=c++11 ${file} -o ${file.replace('.cpp', '')} && ${file.replace('.cpp', '')}`,
        template: `
#include <vector>
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

int main() {
    string input;
    getline(cin, input);
    // Parse input array
    vector<int> nums;
    int target;
    cin >> target;
    
    Solution solution;
    vector<int> result = solution.solution(nums, target);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size()-1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`
    },
    "Java": {
        extension: "java",
        runCommand: (filepath) => `javac "${filepath}" && java -cp "${path.dirname(filepath)}" Solution`,
        template: `
import java.util.*;

class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        int target = scanner.nextInt();
        
        // Parse input array
        String[] parts = input.substring(1, input.length()-1).split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        Solution solution = new Solution();
        int[] result = solution.solution(nums, target);
        
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if(i < result.length-1) System.out.print(",");
        }
        System.out.println("]");
    }
}`
    }
};

function getLanguageFromExtension(ext) {
    const mapping = { 'js': 'JavaScript', 'py': 'Python', 'cpp': 'C++', 'java': 'Java' };
    return mapping[ext] || null;
}

module.exports = {
    languageConfig,
    getLanguageFromExtension
};