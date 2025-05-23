import {
  Abi,
  Hex,
  RawContractError,
  decodeErrorResult,
  type DecodeErrorResultReturnType,
} from "viem";
import { getKnownPanicReason } from "../../constants.js";
import { formatArgs } from "./formatArgs.js";

export const isWalkableError = (
  err: unknown
): err is { walk: () => RawContractError } =>
  typeof err === "object" &&
  err !== null &&
  "walk" in err &&
  typeof err["walk"] === "function";

export const getRawErrorData = (
  error: RawContractError
): Hex | DecodeErrorResultReturnType | undefined => {
  if (typeof error.data !== "object") return error.data;
  if (typeof error.data.data === "string") return error.data.data;
  if (
    "errorName" in error.data &&
    "args" in error.data &&
    "abiItem" in error.data
  )
    return error.data as DecodeErrorResultReturnType;
  return undefined;
};

const tryDecodeReturnData = ({ abi, data }: { abi: Abi; data: Hex }) => {
  try {
    return decodeErrorResult({ abi, data });
  } catch {
    return null;
  }
};

export const errorWhy = {
  empty: "transaction reverted without a reason",
  unknownContract: "transaction reverted with unknown error",
  panic: (code: bigint, description: string) =>
    `transaction reverted with panic code: ${code} (${description})`,
  error: (reason: string) => `transaction reverted with string: ${reason}`,
  custom: (name: string, args: readonly unknown[] | undefined) =>
    `transaction reverted with error: ${name}(${formatArgs(args)})`,
};

export const getReturnDataFromError = (
  subject: { abi: Abi },
  error: unknown
) => {
  if (!isWalkableError(error)) return { kind: "unknown-local" } as const;
  const sourceError = error.walk();
  const raw = getRawErrorData(sourceError);
  if (!raw) return { kind: "unknown-local" } as const;

  if (raw === "0x")
    return { kind: "empty", sourceError, why: errorWhy.empty } as const;

  const decodedReturnData =
    typeof raw === "object"
      ? raw
      : tryDecodeReturnData({
          abi: subject.abi,
          data: raw,
        });
  if (!decodedReturnData)
    return {
      kind: "unknown-contract",
      sourceError,
      why: errorWhy.unknownContract,
    } as const;

  if (decodedReturnData.errorName === "Panic") {
    const code = decodedReturnData.args![0] as bigint;
    return {
      kind: "panic",
      code,
      description: getKnownPanicReason(code),
      sourceError,
      why: errorWhy.panic(code, getKnownPanicReason(code)),
    } as const;
  }

  if (decodedReturnData.errorName === "Error") {
    return {
      kind: "error",
      reason: decodedReturnData.args![0] as string,
      sourceError,
      why: errorWhy.error(decodedReturnData.args![0] as string),
    } as const;
  }

  return {
    kind: "custom",
    name: decodedReturnData.errorName,
    args: decodedReturnData.args,
    sourceError,
    why: errorWhy.custom(decodedReturnData.errorName, decodedReturnData.args),
  } as const;
};
