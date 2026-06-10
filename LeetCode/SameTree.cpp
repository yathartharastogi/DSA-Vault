/*
 * Problem : Same Tree
 * Platform : LeetCode #100
 * Difficulty : Easy
 * Topic : Tree, Recursion, DFS
 *
 * Time Complexity : O(n)
 * Space Complexity : O(h)
 * Submitted by : Yathartha Rastogi
 * Date : 2026-06-10
 * Day : 3
 */

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (p == nullptr && q == nullptr) {
            return true;
        }
        if (p == nullptr || q == nullptr) {
            return false;
        }
        if (p->val != q->val) {
            return false;
        }
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
};
