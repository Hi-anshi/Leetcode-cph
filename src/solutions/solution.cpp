#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

class Solution {
public:
    int solution(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for(int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if(map.count(complement)) {
                return nums[map[complement]] + nums[i];
            }
            map[nums[i]] = i;
        }
        return 0;
    }
};

int main() {
    Solution s;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    cout << s.solution(nums, target) << endl;
    return 0;
}