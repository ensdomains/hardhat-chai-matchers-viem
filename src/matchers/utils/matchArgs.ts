import { Anything, equals } from "@vitest/expect";

export const withAnyValue = (
  expectedArgs: unknown[],
  actualArgs: readonly unknown[] | undefined
) => {
  if (!actualArgs) return;
  for (let i = 0; i < expectedArgs.length; i++) {
    if (expectedArgs[i] instanceof Anything) expectedArgs[i] = actualArgs[i];
  }
};

export const matchArgs = (
  expectedArgs: unknown[] | Record<string, unknown>,
  actualArgs: readonly unknown[] | Record<string, unknown> | undefined
) => {
  if (!actualArgs) return false;
  if (Array.isArray(actualArgs)) {
    if (expectedArgs.length !== actualArgs.length) return false;
  }

  const equalsResult = equals(expectedArgs, actualArgs);

  return equalsResult;
};
