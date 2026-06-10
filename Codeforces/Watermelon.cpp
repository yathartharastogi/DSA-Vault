/*
 * Problem : Watermelon
 * Platform : Codeforces #4A
 * Difficulty : Easy
 * Topic : Math, Brute Force
 *
 * Time Complexity : O(1)
 * Space Complexity : O(1)
 * Submitted by : Yathartha Rastogi
 * Date : 2026-06-11
 * Day : 4
 */

#include <iostream>

int main() {
    int w;
    std::cin >> w;
    if (w > 2 && w % 2 == 0) {
        std::cout << "YES" << std::endl;
    } else {
        std::cout << "NO" << std::endl;
    }
    return 0;
}
