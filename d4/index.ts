import * as fs from "fs";
import * as path from "path";


console.time("bench")
let source: string = fs.readFileSync(
  path.resolve(__dirname, "source.txt"),
  "utf8"
);

interface PassportInterface {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

class Passport {
  private source: string;
  private passportObject: PassportInterface;

  constructor(source: string) {
    this.source = source;
    this.setObject(this.parseToObject(source));
  }

  private parseToObject(source: string) {
    const passportObject: PassportInterface = {};

    const inlineSource = source.replace(/\n/g, " ");
    const pairSources = inlineSource.split(" ").filter((i) => i != "");
    for (const pair of pairSources) {
      const [key, value] = pair.split(":");
      passportObject[key] = value;
    }

    return passportObject;
  }

  private setObject(passportObject: PassportInterface) {
    this.passportObject = passportObject;
  }

  public getProp(prop: string): string | undefined {
    return this.passportObject[prop];
  }

  public getAllProps(): PassportInterface {
    return this.passportObject;
  }

  public getAllPropNames(): string[] {
    return Object.keys(this.passportObject);
  }

  public applyRules(rules: Rule[]) {
    for (const rule of rules) {
      if (!rule.apply(this)) {
        return false;
      }
    }
    return true;
  }
}

class Rule {
  private validationFunction: Function;
  constructor(validationFunction: Function) {
    this.validationFunction = validationFunction;
  }

  public apply(passport: Passport): boolean {
    try {
      const validStatus = this.validationFunction(passport);
      return validStatus;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

const passportSourceList: string[] = source.split("\n\n");
const passportList: Passport[] = passportSourceList.map(
  (passportSource) => new Passport(passportSource)
);

// (Birth Year) - four digits; at least 1920 and at most 2002.
const BirthRule = new Rule((passport: Passport) => {
  const birthYear = passport.getProp("byr");
  if (
    !birthYear ||
    birthYear.length != 4 ||
    parseInt(birthYear) > 2002 ||
    parseInt(birthYear) < 1920
  ) {
    console.log("Failed by birth date", birthYear);
    return false;
  }
  return true;
});

// (Issue Year) - four digits; at least 2010 and at most 2020.
const IssueRule = new Rule((passport: Passport) => {
  const issueYear = passport.getProp("iyr");
  if (
    !issueYear ||
    issueYear.length != 4 ||
    parseInt(issueYear) > 2020 ||
    parseInt(issueYear) < 2010
  ) {
    console.log("Failed by issue date", issueYear);
    return false;
  }
  return true;
});

// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
const ExpirationRule = new Rule((passport: Passport) => {
  const expYear = passport.getProp("eyr");
  if (
    !expYear ||
    expYear.length != 4 ||
    parseInt(expYear) > 2030 ||
    parseInt(expYear) < 2020
  ) {
    console.log("Failed by exp date", expYear);
    return false;
  }
  return true;
});
/**
 * hgt (Height) - a number followed by either cm or in:
    If cm, the number must be at least 150 and at most 193.
    If in, the number must be at least 59 and at most 76.
 */
const HeightRule = new Rule((passport: Passport) => {
  const height = passport.getProp("hgt");
  if (!height) {
    console.log("Failed by heigth", height);
    return false;
  }
  if (height.indexOf("cm") >= 0) {
    const heightNum = height.substr(height.length - 2);
    if (parseInt(heightNum) > 193 || parseInt(heightNum) < 150) {
      console.log("INVALID HEIGTH", height);
      return false;
    }
  } else if (height.indexOf("in") >= 0) {
    const heightNum = height.substr(height.length - 2);
    if (parseInt(heightNum) > 76 || parseInt(heightNum) < 59) {
      console.log("INVALID HEIGTH", height);
      return false;
    }
  } else {
    console.log("INVALID HEIGTH", height);
    return false;
  }
  return true;
});

// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
const HairRule = new Rule((passport: Passport) => {
  const hairColor = passport.getProp("hcl");
  if (!hairColor || hairColor.length != 7 || hairColor[0] != "#") {
    console.log("Failed by hairColor", hairColor);
    return false;
  }

  const parsedColor = hairColor
    .substring(hairColor.length - 6)
    .replace(/[0-9]|[a-f]/g, "");

  if (parsedColor.length !== 0) {
    console.log("Failed by hair color", parsedColor, " , ", hairColor);
    return false;
  }
  return true;
});

// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
const EyeRule = new Rule((passport: Passport) => {
  const EyeColor = passport.getProp("ecl");
  const VALID_EYE_COLORS = new Set([
    "amb",
    "blu",
    "brn",
    "gry",
    "grn",
    "hzl",
    "oth",
  ]);

  if (!EyeColor || EyeColor.length != 3 || !VALID_EYE_COLORS.has(EyeColor)) {
    console.log("Failed by EyeColor", EyeColor);
    return false;
  }
  return true;
});

// pid (Passport ID) - a nine-digit number, including leading zeroes.
const PidRule = new Rule((passport: Passport) => {
  const pid = passport.getProp("pid") || "";
  const parsedPid = pid.replace(/[0-9]/g, "");
  if (!pid || pid.length != 9 || parsedPid.length != 0) {
    console.log("Failed by pid", pid);
    return false;
  }
  return true;
});

const CidRule = new Rule(() => {
  return true;
});

const MANDATORY_PROPS = [
  "byr",
  "iyr",
  "eyr",
  "hgt",
  "hcl",
  "ecl",
  "pid"
]

const hasAllKeysRule = new Rule((passport: Passport) => {
  const keys = passport.getAllPropNames();
  if (keys.length < MANDATORY_PROPS.length) {
    return false
  }
  const keySet = new Set(keys)

  for (let prop of MANDATORY_PROPS) {
    if (!keySet.has(prop)){
      return false
    }
  }

  return true
});

const valid = passportList.filter((passport) =>
  passport.applyRules([
    hasAllKeysRule,
    BirthRule,
    IssueRule,
    ExpirationRule,
    HeightRule,
    HairRule,
    EyeRule,
    PidRule,
    CidRule,
  ])
); 

console.log(valid.length);
console.timeEnd("bench")
