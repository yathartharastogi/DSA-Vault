/*
 * Problem : Remove Linked List Elements
 * Platform : LeetCode #203
 * Difficulty : Easy
 * Topic : Linked List
 *
 * Time Complexity : O(n)
 * Space Complexity : O(1)
 * Submitted by : Yathartha Rastogi
 */


 
class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode dummy(0);
        dummy.next = head;
        
        ListNode* curr = &dummy;
        
        while (curr->next != nullptr) {
            if (curr->next->val == val) {
                ListNode* toDelete = curr->next;
                
                curr->next = curr->next->next;
                
                delete toDelete; 
            } else {
                curr = curr->next;
            }
        }
        
        return dummy.next;
    }
};