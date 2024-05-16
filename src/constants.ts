// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#panic-via-assert-and-error-via-require
export const panicReasons = {
  1: "An `assert` condition failed",
  17: "Arithmetic operation resulted in underflow or overflow",
  18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`)",
  33: "Attempted to convert to an invalid type",
  34: "Attempted to access a storage byte array that is incorrectly encoded",
  49: "Performed `.pop()` on an empty array",
  50: "Array index is out of bounds",
  65: "Allocated too much memory or created an array which is too large",
  81: "Attempted to call a zero-initialized variable of internal function type",
} as const;

export const maxKnownPanicCode = 81 as const;

export const getKnownPanicReason = (code: bigint) => {
  if (code <= maxKnownPanicCode) {
    return panicReasons[Number(code) as PanicCode];
  }
  return "Unknown panic code" as const;
};

export type PanicCode = keyof typeof panicReasons;

export const anyValueSymbol = Symbol.for("hh-viem-chai-matchers:anyValue");
