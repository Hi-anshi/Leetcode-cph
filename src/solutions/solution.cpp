
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
};