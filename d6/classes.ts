export class Answer {
  private originalAns: string;

  constructor(sourceAns: string) {
    this.originalAns = sourceAns;
  }

  public getOriginalAns(): string {
    return this.originalAns;
  }
}

export class Group {
  private answers: Answer[] = [];

  addAnswer(ans: Answer) {
    this.answers.push(ans);
  }

  getAllAns() {
    return this.answers;
  }

  getUniqueAnsCount() {
    const ansStringList: string[] = this.answers
      .map((ans) => [...ans.getOriginalAns()])
      .reduce((a, b) => [...a, ...b]);
    const uniqueAns = new Set(ansStringList);
    return uniqueAns.size;
  }

  getUnanimousCount() {
    let charCount = {};
    const ansStringList: string[] = this.answers
      .map((ans) => [...ans.getOriginalAns()])
      .reduce((a, b) => [...a, ...b]);

    for (let char of ansStringList) {
      if (charCount[char]) {
        charCount[char] += 1;
      } else {
        charCount[char] = 1;
      }
    }

    let unanimousCount = 0;

    for (const key of Object.keys(charCount)) {
      if (charCount[key] == this.getAllAns().length) {
        unanimousCount += 1;
      }
    }

    return unanimousCount;
  }
}

export class Plane {
  private groupList: Group[] = [];

  addGroup(group: Group) {
    this.groupList.push(group);
  }

  getAllUniqueAnsCount(): number {
    const uniqueCount = this.groupList
      .map((g) => g.getUniqueAnsCount())
      .reduce((a, b) => a + b);
    return uniqueCount;
  }

  getAllUnanimousCount(): number {
    const uniqueCount = this.groupList
      .map((g) => g.getUnanimousCount())
      .reduce((a, b) => a + b);
    return uniqueCount;
  }
}
