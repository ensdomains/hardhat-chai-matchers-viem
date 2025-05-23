import { Hash } from "viem";
import { HardhatChaiMatchersNonChainableMatcherError } from "../errors.js";
import { PREVIOUS_MATCHER_NAME } from "./constants.js";

const getFlag = <value, defaultValue>(
  assertion: Chai.AssertionStatic,
  flagName: string,
  defaultValue?: defaultValue
): value | defaultValue => {
  const assertion_ = assertion as typeof assertion & {
    __flags?: Record<string, any>;
  };
  assertion_.__flags = assertion_.__flags || ({} as Record<string, any>);
  const value = assertion_.__flags[flagName];
  if (typeof value !== "undefined") return value;
  assertion_.__flags[flagName] = defaultValue;
  return assertion_.__flags[flagName] as defaultValue;
};

const setFlag = <T>(
  assertion: Chai.AssertionStatic,
  flagName: string,
  value: T
): void => {
  const assertion_ = assertion as typeof assertion & {
    __flags?: Record<string, any>;
  };
  assertion_.__flags = assertion_.__flags || ({} as Record<string, any>);
  assertion_.__flags[flagName] = value;
};

export const setLockSsfi = (assertion: Chai.AssertionStatic, value: boolean) =>
  setFlag<boolean>(assertion, "lockSsfi", value);

export const getNegated = (assertion: Chai.AssertionStatic) =>
  getFlag<boolean, false>(assertion, "negate", false);

export const getObject = (assertion: Chai.AssertionStatic) =>
  getFlag<unknown, undefined>(assertion, "object");

export const getHashOnly = (assertion: Chai.AssertionStatic) =>
  getFlag<boolean, false>(assertion, "hashOnly", false);
export const setHashOnly = (assertion: Chai.AssertionStatic, value: boolean) =>
  setFlag<boolean>(assertion, "hashOnly", value);

export const getWriteResult = (assertion: Chai.AssertionStatic) =>
  getFlag<Promise<Hash>, undefined>(assertion, "writeResult");
export const setWriteResult = (
  assertion: Chai.AssertionStatic,
  value: unknown
) => setFlag<unknown>(assertion, "writeResult", value);

export const getReadResult = (assertion: Chai.AssertionStatic) =>
  getFlag<Promise<unknown>, undefined>(assertion, "readResult");
export const setReadResult = (
  assertion: Chai.AssertionStatic,
  value: unknown
) => setFlag<unknown>(assertion, "readResult", value);

export const getWithArgs = <T = unknown[] | Record<string, unknown>>(
  assertion: Chai.AssertionStatic
) => getFlag<T, undefined>(assertion, "withArgs");
export const setWithArgs = (
  assertion: Chai.AssertionStatic,
  value: unknown[] | Record<string, unknown>
) => setFlag<unknown[] | Record<string, unknown>>(assertion, "withArgs", value);

const getPreviousMatcherName = (assertion: Chai.AssertionStatic) =>
  getFlag<string, undefined>(assertion, PREVIOUS_MATCHER_NAME);
const setPreviousMatcherName = (
  assertion: Chai.AssertionStatic,
  value: string
) => setFlag<string>(assertion, PREVIOUS_MATCHER_NAME, value);

export const preventAsyncMatcherChaining = (
  assertion: Chai.AssertionStatic,
  {
    matcherName,
    allowSelfChaining = false,
    allowHashOnly = false,
  }: {
    matcherName: string;
    allowSelfChaining?: boolean;
    allowHashOnly?: boolean;
  }
) => {
  const previousMatcherName = getPreviousMatcherName(assertion);
  const hashOnly = getHashOnly(assertion);

  if (hashOnly && !allowHashOnly)
    throw new HardhatChaiMatchersNonChainableMatcherError(
      matcherName,
      "transaction(hash)"
    );

  if (previousMatcherName === undefined) {
    setPreviousMatcherName(assertion, matcherName);
    return;
  }

  if (previousMatcherName === matcherName && allowSelfChaining) {
    return;
  }

  throw new HardhatChaiMatchersNonChainableMatcherError(
    matcherName,
    previousMatcherName
  );
};
