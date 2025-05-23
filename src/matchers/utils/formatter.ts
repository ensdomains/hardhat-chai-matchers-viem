import { stringify } from "@vitest/utils";
import { printDiffOrStringify } from "@vitest/utils/diff";
import type { Formatter } from "tinyrainbow";
import c from "tinyrainbow";

export const EXPECTED_COLOR: Formatter = c.green;
export const RECEIVED_COLOR: Formatter = c.red;
export const INVERTED_COLOR: Formatter = c.inverse;
export const BOLD_WEIGHT: Formatter = c.bold;
export const DIM_COLOR: Formatter = c.dim;

export const formatter = {
  EXPECTED_COLOR,
  RECEIVED_COLOR,
  INVERTED_COLOR,
  BOLD_WEIGHT,
  DIM_COLOR,
};

type MatcherHintOptions = {
  matcherName: string;
  expected?: string;
  received?: string;
  comment?: string;
  isDirectExpectCall?: boolean;
  isNot?: boolean;
  promise?: string;
  secondArgument?: string;
  expectedColor?: Formatter;
  receivedColor?: Formatter;
  secondArgumentColor?: Formatter;
  chainedMatcher?: Omit<MatcherHintOptions, "isNot" | "promise">;
};

export function matcherHint(
  {
    matcherName,
    expected = "expected",
    received = "received",
    comment = "",
    isDirectExpectCall = false,
    isNot = false,
    promise = "",
    secondArgument = "",
    expectedColor = EXPECTED_COLOR,
    receivedColor = RECEIVED_COLOR,
    secondArgumentColor = EXPECTED_COLOR,
    chainedMatcher,
  }: MatcherHintOptions,
  isChained: boolean = false
): string {
  let hint = "";
  let dimTail = isChained ? "" : "expect";

  if (!isChained) {
    if (!isDirectExpectCall && received !== "") {
      hint += DIM_COLOR(`${dimTail}(`) + receivedColor(received);
      dimTail = ")";
    }

    if (promise) {
      hint += DIM_COLOR(`${dimTail}.`) + promise;
      dimTail = "";
    }

    if (isNot) {
      hint += DIM_COLOR(`${dimTail}.`) + "not";
      dimTail = "";
    }
  }

  if (matcherName.includes(".")) {
    dimTail += matcherName;
  } else {
    hint += DIM_COLOR(`${dimTail}.`) + matcherName;
    dimTail = "";
  }

  if (expected === "") {
    dimTail += "()";
  } else {
    hint += DIM_COLOR(`${dimTail}(`) + expectedColor(expected);
    if (secondArgument) {
      hint += DIM_COLOR(", ") + secondArgumentColor(secondArgument);
    }
    dimTail = ")";
  }

  if (comment) dimTail += ` // ${comment}`;
  if (dimTail) hint += DIM_COLOR(dimTail);
  if (chainedMatcher) hint += matcherHint(chainedMatcher, true);

  return hint;
}

const fmt = (v: unknown) =>
  typeof v === "string" ? `"${v}"` : stringify(v, 2);

export const expectedLine = (v: unknown) =>
  `${DIM_COLOR("Expected:")} ${EXPECTED_COLOR(fmt(v))}`;

export const receivedLine = (v: unknown) =>
  `${DIM_COLOR("Received:")} ${RECEIVED_COLOR(fmt(v))}`;

export const diffBlock = (exp: unknown, rec: unknown) => {
  if (exp === rec) return "";
  const diff = printDiffOrStringify(rec, exp, {
    aAnnotation: "Expected",
    bAnnotation: "Received",
    aColor: EXPECTED_COLOR,
    bColor: RECEIVED_COLOR,
    expand: false,
    includeChangeCounts: false,
  });
  return diff ? "\n" + diff : "";
};
