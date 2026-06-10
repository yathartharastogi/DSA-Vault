/*
 * Problem : Remove Linked List Elements
 * Platform : LeetCode #203
 * Difficulty : Easy
 * Topic : Linked List, Recursion
 *
 * Time Complexity : O(n)
 * Space Complexity : O(1)
 * Submitted by : Yathartha Rastogi
 * Date : 2026-06-09
 * Day : 2
 */

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode dummy(0, head);
        ListNode* prev = &dummy;
        ListNode* curr = head;
        
        while (curr != nullptr) {
            if (curr->val == val) {
                prev->next = curr->next;
            } else {
                prev = curr;
            }
            curr = curr->next;
        }
        
        return dummy.next;
    }
};
