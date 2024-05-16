import { Abi, Hex, RawContractError, decodeErrorResult } from "viem";
import { getKnownPanicReason } from "../../constants.js";

export const getRawErrorData = (err: unknown) => {
  if (
    typeof err !== "object" ||
    !err ||
    !("walk" in err) ||
    typeof err["walk"] !== "function"
  )
    return undefined;
  const error = err.walk() as RawContractError;
  const hex = typeof error.data === "object" ? error.data.data : error.data;
  return hex;
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
  const hex = getRawErrorData(error);
  if (!hex) return { kind: "unknown-local" } as const;

  if (hex === "0x") return { kind: "empty" } as const;

  const decodedReturnData = tryDecodeReturnData({
    abi: subject.abi,
    data: hex,
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
