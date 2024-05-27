import { equals } from "@vitest/expect";
import { anyValueSymbol } from "../../constants.js";

const anyValueTester = (a: unknown, b: unknown) => {
  if (a === anyValueSymbol) return true;
};

export const withAnyValue = (
  expectedArgs: unknown[],
  actualArgs: readonly unknown[] | undefined
) => {
  if (!actualArgs) return;
  for (let i = 0; i < expectedArgs.length; i++) {
    if (expectedArgs[i] === anyValueSymbol) expectedArgs[i] = actualArgs[i];
  }
};

export const matchArgs = (
  expectedArgs: unknown[],
  actualArgs: readonly unknown[] | undefined
) => {
  if (!actualArgs) return false;
  if (expectedArgs.length !== actualArgs.length) return false;

  const equalsResult = equals(expectedArgs, actualArgs, [anyValueTester]);

  return equalsResult;
};
