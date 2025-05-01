import type { UnknownReadPromise, UnknownWritePromise } from "../../types.js";

const hasCallMetadata = (
  subject: unknown
): subject is UnknownWritePromise | UnknownReadPromise => {
  if (typeof subject !== "object" || subject === null) return false;

  return (
    "__call_metadata" in subject &&
    typeof subject.__call_metadata === "object" &&
    subject.__call_metadata !== null
  );
};

export const getCall = (
  assertion: Chai.AssertionStatic,
  matcher: string
): UnknownWritePromise | UnknownReadPromise => {
  const subject: unknown = assertion._obj;

  if (!hasCallMetadata(subject))
    throw new Error(
      `The \`${matcher}\` matcher can only be used with a contract call`
    );

  return subject as UnknownWritePromise | UnknownReadPromise;
};
