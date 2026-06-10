/*
 * Problem : Same Tree
 * Platform : LeetCode #100
 * Difficulty : Easy
 * Topic : Binary Tree, Recursion
 *
 * Time Complexity : O(n)
 * Space Complexity : O(h)
 * Submitted by : Yathartha Rastogi
 */



 class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {

       if(p == nullptr && q == nullptr){
        return true;
       }

       if(p == nullptr || q == nullptr){
        return false;
       }

       if(p->val != q->val){
        return false;
       }

       return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
    }
};