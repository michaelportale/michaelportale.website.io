Expectations:
    I expect the HashMap data structure to have the best (fastest) performance of the three data structures. I expect
    BSTree data structure to have the worst (slowest) performance. Last, I expect RBTree to fall somewhere in between.

Execution times:
- BST:
    * Run 1: 1.512
    * Run 2: 1.457
    * Run 3: 1.390
    * Run 4: 1.392
    * Run 5: 1.421
    * Average: 1.4344

- RBT:
    * Run 1: .623
    * Run 2: .605
    * Run 3: .538
    * Run 4: .557
    * Run 5: .561
    * Average: .5768

- Hash:
    * Run 1: .313
    * Run 2: .321
    * Run 3: .333
    * Run 4: .423
    * Run 5: .318
    * Average: .3416

Results and Analysis:
The results of my program's executions matches my expectations.

The HashMap data structure runs constant-time O(1) average-case complexity for insertion and retrieval operations.
Meaning that the time taken for these operations remains relatively constant regardless of the size of the dataset.
As a result, using a HashMap should yield the fastest execution times, even with a large number of words. The Hash's
ability to distribute keys uniformly across buckets should allow for efficient access and minimize collisions.

The RBTree is a self-balancing binary search tree that runs logarithmic O(log n) time complexity for insertion and
retrieval operations. While it is not quite as fast as a Hash, it should still provide relatively quick execution times
due to its balanced nature and efficient search and insertion algorithms. The RBT's self-balancing property ensures that
the tree remains balanced, preventing performance degradation with larger datasets.

The BSTree, without any balancing property, has an average-case time complexity of O(log n) for insertion and retrieval
operations. However, in the worst case, when the tree becomes unbalanced, the time complexity can degrade to O(n), where
n is the number of elements. With a large dataset like words.txt, the BST is more likely to experience unbalanced
scenarios, leading to slower performance compared to the HashMap and RBT. The BST's performance can be significantly
impacted by the order of insertions, and in the worst case, it may exhibit linear time complexity.