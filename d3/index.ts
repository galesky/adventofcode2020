import { TREE_MAP_PATTERN } from "./assets";

// Pattern of 31 chars ( 0 -> 30)

const countTreesBySlope = (
  verticalStepSize: number,
  horizontalStepSize: number
): number => {
  let currentStepHorizontal = horizontalStepSize;
  let currentStepVertical = verticalStepSize;
  let treeCount = 0;

  for (
    currentStepVertical;
    currentStepVertical < TREE_MAP_PATTERN.length;
    currentStepVertical += verticalStepSize
  ) {
    if (
      TREE_MAP_PATTERN[currentStepVertical][currentStepHorizontal % 31] == "#"
    ) {
      treeCount += 1;
    }
    currentStepHorizontal += horizontalStepSize;
  }
  return treeCount;
};
const slopeCases: number[][] = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
  [2, 1],
];
let partialTreeCounts: (number | undefined)[] = [];

for (const slopeCase of slopeCases) {
    const currentCaseTreeCount = countTreesBySlope(slopeCase[0], slopeCase[1])
    partialTreeCounts.push(currentCaseTreeCount);
}

console.log("Partial results: ", partialTreeCounts);
console.log("Final mutiple", partialTreeCounts.reduce((a,b) => a*b))
