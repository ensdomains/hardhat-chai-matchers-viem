import { Hash } from "viem";

export function isValidTransactionHash(x: unknown): x is Hash {
  if (typeof x !== "string") return false;
  return /0x[0-9a-fA-F]{64}/.test(x);
}
