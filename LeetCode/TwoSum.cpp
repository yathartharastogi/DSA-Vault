/*
 * Problem : Two Sum
 * Platform : LeetCode #1
 * Difficulty : Easy
 * Topic : Array, Hash Map
 *
 * Time Complexity : O(n)
 * Space Complexity : O(n)
 * Submitted by : Yathartha Rastogi
 * Date : 2026-06-08
 * Day : 1
 */

#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> num_to_index;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (num_to_index.find(complement) != num_to_index.end()) {
                return {num_to_index[complement], i};
            }
            num_to_index[nums[i]] = i;
        }
        return {};
    }
};
