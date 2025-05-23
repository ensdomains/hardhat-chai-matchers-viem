import {} from "vitest";
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
    throw new TypeError(
      `You must provide a pending contract call to expect() when using .${matcher}, not '${typeof subject}'`
    );

  return subject as UnknownWritePromise | UnknownReadPromise;
};
