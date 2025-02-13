import {
  Abi,
  Hex,
  RawContractError,
  decodeErrorResult,
  type DecodeErrorResultReturnType,
} from "viem";
import { getKnownPanicReason } from "../../constants.js";

export const getRawErrorData = (
  err: unknown
): Hex | DecodeErrorResultReturnType | undefined => {
  if (
    typeof err !== "object" ||
    !err ||
    !("walk" in err) ||
    typeof err["walk"] !== "function"
  )
    return undefined;
  const error = err.walk() as RawContractError;
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

export const getReturnDataFromError = (
  subject: { abi: Abi },
  error: unknown
) => {
  const raw = getRawErrorData(error);
  if (!raw) return { kind: "unknown-local" } as const;

  if (raw === "0x") return { kind: "empty" } as const;

  const decodedReturnData =
    typeof raw === "object"
      ? raw
      : tryDecodeReturnData({
          abi: subject.abi,
          data: raw,
        });
  if (!decodedReturnData) return { kind: "unknown-contract" } as const;

  if (decodedReturnData.errorName === "Panic") {
    const code = decodedReturnData.args![0] as bigint;
    return {
      kind: "panic",
      code,
      description: getKnownPanicReason(code),
    } as const;
  }

  if (decodedReturnData.errorName === "Error") {
    return {
      kind: "error",
      reason: decodedReturnData.args![0] as string,
    } as const;
  }

  return {
    kind: "custom",
    name: decodedReturnData.errorName,
    args: decodedReturnData.args,
  } as const;
};
