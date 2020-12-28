import { PASSWORD_LIST } from "./assets";

let validPasswords: number = 0;

const oldPolicy = (policy: string, char: string, pass: string): boolean => {
  const [lower, upper] = policy.split("-");
  const targetCharCount = (pass.match(RegExp(char, "g")) || []).length;
  if (
    targetCharCount >= parseInt(lower) &&
    targetCharCount <= parseInt(upper)
  ) {
    return true;
  }
  return false;
};

const newPolicy = (policy: string, char: string, pass: string): boolean => {
  const [lower, upper] = policy.split("-");
  let matchCount = 0;

  if (pass[parseInt(lower) - 1] == char) {
    matchCount += 1;
  }
  if (pass[parseInt(upper) - 1] == char) {
    matchCount += 1;
  }

  if (matchCount != 1) {
    return false;
  }
  return true;
};

const passwordIsValid = (
  policy: string,
  char: string,
  pass: string,
  policyVersion: string
): boolean => {
  const policies = {
    new: newPolicy,
    old: oldPolicy,
  };
  return policies[policyVersion](policy, char, pass);
};

for (const password of PASSWORD_LIST) {
  const [policy, char, pass] = password.split(" ");
  if (passwordIsValid(policy, char[0], pass, "new")) {
    validPasswords += 1;
  }
}

console.log("Total number of valid passwords: ", validPasswords);
