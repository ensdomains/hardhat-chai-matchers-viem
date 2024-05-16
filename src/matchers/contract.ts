import { READ_MATCHER, WRITE_MATCHER } from "./constants.js";
import { getNegated, setReadResult, setWriteResult } from "./utils.js";

export function supportContract(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    WRITE_MATCHER,
    function (this: Chai.AssertionStatic, ...matcherArgs: unknown[]) {
      const negated = getNegated(this);

      if (negated) {
        throw new Error("The `write` matcher cannot be negated");
      }

      const subject: unknown = this._obj;

      if (!subject || typeof subject !== "object") {
        throw new Error("The `write` matcher can only be used with a contract");
      }

      if (
        !("write" in subject) ||
        typeof subject["write"] !== "object" ||
        !subject["write"]
      ) {
        throw new Error(
          "The `write` matcher can only be used with a contract that has write functions"
        );
      }

      const [functionName, ...argsAndOptions] = matcherArgs;

      if (typeof functionName !== "string") {
        throw new Error(
          "The `write` matcher must be called with a function name"
        );
      }

      const writeFunction = subject["write"][
        functionName as keyof (typeof subject)["write"]
      ] as (...args: typeof argsAndOptions) => Promise<any>;

      setWriteResult(this, writeFunction(...argsAndOptions));

      return this;
    }
  );
  Assertion.addMethod(
    READ_MATCHER,
    function (this: Chai.AssertionStatic, ...matcherArgs: unknown[]) {
      const negated = getNegated(this);

      if (negated) {
        throw new Error("The `read` matcher cannot be negated");
      }

      const subject: unknown = this._obj;

      if (!subject || typeof subject !== "object") {
        throw new Error("The `read` matcher can only be used with a contract");
      }

      if (
        !("read" in subject) ||
        typeof subject["read"] !== "object" ||
        !subject["read"]
      ) {
        throw new Error(
          "The `read` matcher can only be used with a contract that has read functions"
        );
      }

      const [functionName, ...argsAndOptions] = matcherArgs;

      if (typeof functionName !== "string") {
        throw new Error(
          "The `read` matcher must be called with a function name"
        );
      }

      const readFunction = subject["read"][
        functionName as keyof (typeof subject)["read"]
      ] as (...args: typeof argsAndOptions) => Promise<any>;

      setReadResult(this, readFunction(...argsAndOptions));

      return this;
    }
  );
}
