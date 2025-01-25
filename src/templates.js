const templates = {
    js: {
        wrapper: (userCode) => `
${userCode}

// Read input
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = parseInt(input[1]);
console.log(JSON.stringify(solution(nums, target)));`
    },
    py: {
        wrapper: (userCode) => `
${userCode}

# Read input
import sys, json
try:
    input_lines = sys.stdin.readlines()
    if len(input_lines) < 2:
        print("[]")  # Default output for invalid input
    else:
        nums = json.loads(input_lines[0])
        target = int(input_lines[1])
        result = solution(nums, target)
        print(json.dumps(result))
except Exception as e:
    print("[]")  # Default output for any errors`
    },
    cpp: {
        wrapper: (userCode) => `
#include <vector>
#include <string>
#include <iostream>
#include <unordered_map>

// Individual std imports instead of namespace
using std::vector;
using std::string;
using std::cout;
using std::cin;
using std::endl;
using std::unordered_map;
using std::getline;
using std::stoi;

// Remove duplicate Solution class and fix namespace
${userCode.replace(/using namespace std;/, '').replace(/class Solution {[\s\S]*?};/, '')}

// Helper functions
vector<int> parseArray(const string& input) {
    vector<int> nums;
    size_t start = input.find('[');
    size_t end = input.find(']');
    if (start != string::npos && end != string::npos) {
        string nums_str = input.substr(start + 1, end - start - 1);
        size_t pos = 0;
        while ((pos = nums_str.find(',')) != string::npos) {
            nums.push_back(stoi(nums_str.substr(0, pos)));
            nums_str.erase(0, pos + 1);
        }
        if (!nums_str.empty()) {
            nums.push_back(stoi(nums_str));
        }
    }
    return nums;
}

void printResult(const vector<int>& result) {
    cout << "[";
    for (size_t i = 0; i < result.size(); ++i) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    try {
        string input;
        getline(cin, input);
        int target;
        cin >> target;
        
        vector<int> nums = parseArray(input);
        Solution solution;
        vector<int> result = solution.solution(nums, target);
        printResult(result);
    } catch (...) {
        cout << "[]" << endl;
    }
    return 0;
}`,
    },
    java: {
        wrapper: (userCode) => `
import java.util.*;

public class Solution {
${userCode}

    public static void main(String[] args) {
        try {
            Scanner scanner = new Scanner(System.in);
            String input = scanner.nextLine().trim();
            int target = scanner.nextInt();
            
            // Parse input array
            input = input.substring(1, input.length()-1);
            String[] parts = input.split(",");
            int[] nums = new int[parts.length];
            for(int i = 0; i < parts.length; i++) {
                nums[i] = Integer.parseInt(parts[i].trim());
            }
            
            Solution solution = new Solution();
            int[] result = solution.solution(nums, target);
            
            // Print result
            System.out.print("[");
            for(int i = 0; i < result.length; i++) {
                System.out.print(result[i]);
                if(i < result.length-1) System.out.print(",");
            }
            System.out.println("]");
        } catch(Exception e) {
            System.out.println("[]");
        }
    }
}`
    }
};

module.exports = templates;