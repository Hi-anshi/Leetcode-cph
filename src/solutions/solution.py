
# Write your solution here
def solution(nums, target):
    if isinstance(nums, list) and isinstance(target, int):
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return nums[seen[complement]] + nums[i]  # Return sum instead of indices
            seen[num] = i
    return 0    

# Test case execution
if __name__ == "__main__":
    # Example test case
    test_nums = [2, 7, 11, 15]
    test_target = 9
    result = solution(test_nums, test_target)
    print(f"Result: {result}")
    