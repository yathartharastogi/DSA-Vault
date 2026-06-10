/*
 * Problem : Group Anagrams
 * Platform : LeetCode #49
 * Difficulty : Medium
 * Topic : Hash Map, String, Sorting
 *
 * Time Complexity : O(n * k log k)
 * Space Complexity : O(n * k)
 * Submitted by : Yathartha Rastogi
 * Date : 2026-06-10
 * Day : 3
 */

#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {
        std::unordered_map<std::string, std::vector<std::string>> anagram_groups;
        for (const std::string& s : strs) {
            std::string key = s;
            std::sort(key.begin(), key.end());
            anagram_groups[key].push_back(s);
        }
        
        std::vector<std::vector<std::string>> result;
        for (auto& pair : anagram_groups) {
            result.push_back(std::move(pair.second));
        }
        return result;
    }
};
