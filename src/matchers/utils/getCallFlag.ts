import { getReadResult, getWriteResult } from "../utils.js";

export const getCall = (assertion: Chai.AssertionStatic, matcher: string) => {
  const functionCall = (() => {
    const writePromise = getWriteResult(assertion);
    if (writePromise) return { kind: "write", promise: writePromise } as const;

    const readPromise = getReadResult(assertion);
    if (readPromise) return { kind: "read", promise: readPromise } as const;

    return null;
  })();

  if (!functionCall)
    throw new Error(
      `The \`${matcher}\` matcher must be used after a \`read\` or \`write\` matcher`
    );

  return functionCall;
};
