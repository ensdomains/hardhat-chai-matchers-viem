import { createColors } from "@vitest/utils";
import { isatty } from "node:tty";
import { anyValueSymbol } from "../../constants.js";

export const matchArgs = (
  expectedArgs: unknown[],
  actualArgs: readonly unknown[] | undefined
) => {
  if (!actualArgs) return false;
  if (expectedArgs.length !== actualArgs.length) return false;

  for (let i = 0; i < expectedArgs.length; i++) {
    if (expectedArgs[i] === anyValueSymbol) continue;
    if (expectedArgs[i] !== actualArgs[i]) return false;
  }

  return true;
};

const stringifyValue = (value: unknown) => {
  if (typeof value === "bigint") return `${value.toString()}n`;
  if (value === anyValueSymbol) return "anyValue";
  return JSON.stringify(value);
};

export const formatMatchError = ({
  msg,
  expected,
  actual,
}: {
  msg: string;
  expected: unknown[];
  actual: readonly unknown[] | undefined;
}) => {
  const colors = createColors(isatty(1));

  return `${colors.red(msg)}
  ${colors.green("+ expected")} ${colors.red("- actual")}

  ${colors.red(`- [${actual?.map(stringifyValue).join(", ")}]`)}
  ${colors.green(`+ [${expected.map(stringifyValue).join(", ")}]`)}`;
};
