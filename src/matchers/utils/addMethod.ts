import { CallSite } from "./CallSite.js";

export function addMethod(
  chai: Chai.ChaiStatic,
  name: string,
  fn: (this: Chai.AssertionStatic, ...args: any[]) => void
) {
  const functionWrapper = function (
    this: Chai.AssertionStatic,
    ...args: any[]
  ) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      Error.captureStackTrace(error, functionWrapper);
      throw error;
    }
  };

  chai.Assertion.addMethod(name, functionWrapper);
}

const cachedSolidityCallSites = new Map<string, NodeJS.CallSite[]>();

const originalPrepareStackTrace = Error.prepareStackTrace!;
function prepareStackTraceWithMiddleware(
  error: Error,
  stack: NodeJS.CallSite[]
) {
  if (!("__solidityStack" in error)) {
    if (error.constructor.name === "SolidityError") {
      let solidityCallSites: NodeJS.CallSite[] = [];
      for (let i = 0; i < stack.length; i++) {
        const callSite = stack[i];
        if (callSite.constructor.name === "SolidityCallSite")
          solidityCallSites.push(callSite);
        // we assume solidity call sites are at the end of the stack
        else break;
      }
      if (!solidityCallSites.length)
        return originalPrepareStackTrace(error, stack);
      const outputStack = originalPrepareStackTrace(error, stack);
      cachedSolidityCallSites.set(outputStack, solidityCallSites);
      return outputStack;
    }
    return originalPrepareStackTrace(error, stack);
  }

  const solidityCallSites = cachedSolidityCallSites.get(
    error.__solidityStack as string
  );
  if (!solidityCallSites) return originalPrepareStackTrace(error, stack);
  const updatedCallSites = solidityCallSites.map(
    (callSite) =>
      new CallSite({
        file: callSite.getFileName(),
        line: callSite.getLineNumber(),
        col: 1,
        fnName: `${callSite.getTypeName()}.${callSite.getMethodName()}`,
      })
  );
  return originalPrepareStackTrace(error, [...stack, ...updatedCallSites]);
}
Error.prepareStackTrace = prepareStackTraceWithMiddleware;
