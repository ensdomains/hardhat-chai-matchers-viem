import { isHash } from "viem";
import {
  READ_MATCHER,
  TRANSACTION_MATCHER,
  WRITE_MATCHER,
} from "./constants.js";
import {
  getNegated,
  setHashOnly,
  setReadResult,
  setWriteResult,
} from "./utils.js";

const getSubject = (
  assertion: Chai.AssertionStatic,
  matcherName: string
): object => {
  const negated = getNegated(assertion);

  if (negated) {
    throw new Error(`The \`${matcherName}\` matcher cannot be negated`);
  }

  const subject: unknown = assertion._obj;

  if (!subject || typeof subject !== "object") {
    throw new Error(
      `The \`${matcherName}\` matcher can only be used with a contract`
    );
  }

  return subject;
};

export function supportContract(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TRANSACTION_MATCHER,
    function (this: Chai.AssertionStatic, transactionHashOrPromise: unknown) {
      getSubject(this, TRANSACTION_MATCHER);

      if (
        typeof transactionHashOrPromise === "string" &&
        isHash(transactionHashOrPromise)
      ) {
        setWriteResult(this, Promise.resolve(transactionHashOrPromise));
        setHashOnly(this, true);
      } else if (transactionHashOrPromise instanceof Promise) {
        setWriteResult(this, transactionHashOrPromise);
      } else {
        throw new Error(
          "The `transaction` matcher must be called with a transaction hash or a promise that resolves to a transaction hash"
        );
      }

      return this;
    }
  );

  Assertion.addMethod(
    WRITE_MATCHER,
    function (this: Chai.AssertionStatic, ...matcherArgs: unknown[]) {
      const subject = getSubject(this, WRITE_MATCHER);

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
      const subject = getSubject(this, READ_MATCHER);

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
