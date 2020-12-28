import * as fs from "fs";
import * as path from "path";
import { Plane, Group, Answer } from "./classes";

const source: string = fs.readFileSync(
  path.resolve(__dirname, "source.txt"),
  "utf8"
);

const MyPlane = new Plane();
let currentGroup = new Group();

const entries = source.split("\n");

for (const answer of entries) {
  if (answer === "") {
    MyPlane.addGroup(currentGroup);
    currentGroup = new Group();
  } else {
    currentGroup.addAnswer(new Answer(answer));
  }
}
MyPlane.addGroup(currentGroup);

console.log(MyPlane.getAllUniqueAnsCount())
console.log(MyPlane.getAllUnanimousCount())

