/* Before you leave, the Elves in accounting just need you to fix your expense report (your puzzle input); apparently, something isn't quite adding up.

Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together. 

3
1 + problema(2)

*/

import { entries } from "./d_2_assets";

const findSumFromSet = (target: number, entryArr: number[]): number => {
  const entries_set = new Set(entryArr);
  for (const entry of entryArr) {
    if (entries_set.has(target - entry)) {
      return entry;
    }
  }
  return 0;
};

for (const entry of entries) {
  const curTarget = 2020 - entry;
  const curResult = findSumFromSet(curTarget, entries);
  if (curResult > 0) {
    console.log(entry, curResult, 2020 - entry - curResult);
    console.log(entry * curResult * (2020 - entry - curResult));
    break
  }
}
