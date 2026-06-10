/*
 * Problem : Two Sum
 * Platform : LeetCode #1
 * Difficulty : Easy
 * Topic : Arrays
 *
 * Time Complexity : O(n²)
 * Space Complexity : O(1)
 * Submitted on: 8/6/2026
 * Submitted by: Yathartha Rastogi
 */



class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i=0; i<nums.size(); i++){
            for(int j=i+1; j<nums.size(); j++){
                if(nums[i]+nums[j]==target){
                    return{i,j};
                }
            }
        }
        return{};
    }
};