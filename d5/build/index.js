import * as fs from "fs";
import * as path from "path";
const source = fs.readFileSync(path.resolve(__dirname, "source.txt"), "utf8");
const seats = source.split('\n');
