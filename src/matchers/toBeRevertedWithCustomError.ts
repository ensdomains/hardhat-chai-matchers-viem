import { AbiError } from "abitype";
import { Abi } from "viem";
import { TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER } from "./constants.js";
import {
  getNegated,
  getWithArgs,
  preventAsyncMatcherChaining,
} from "./utils.js";
import { buildAssert } from "./utils/buildAssert.js";
import { getCall } from "./utils/getCallFlag.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";
import { formatMatchError, matchArgs } from "./utils/matchArgs.js";

export function supportRevertedWithCustomError(
  Assertion: Chai.AssertionStatic
) {
  Assertion.addMethod(
    TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER,
    function (this: Chai.AssertionStatic, expectedCustomErrorName: string) {
      const negated = getNegated(this);

      const subject: { abi: Abi } = this._obj;

      if (typeof expectedCustomErrorName !== "string")
        throw new TypeError(
          `Expected a string, but got '${expectedCustomErrorName}'`
        );

      // this doesn't work with overloaded errors
      const foundError = subject.abi.find(
        (i): i is AbiError =>
          i.type === "error" && i.name === expectedCustomErrorName
      );

      if (!foundError)
        throw new Error(
          `The error '${expectedCustomErrorName}' was not found in the contract ABI`
        );

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER,
      });

      const functionCall = getCall(
        this,
        TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER
      );

      const onSuccess = async () => {
        const assert = buildAssert(!!negated, onSuccess);

        assert({
          condition: false,
          messageFalse: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}', but it didn't revert`,
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(!!negated, onError);
        const returnData = getReturnDataFromError(subject, error);

        const withArgs = getWithArgs(this);

        if (returnData.kind === "unknown-local") throw error;

        if (returnData.kind === "empty") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}', but it reverted without a reason`,
          });
          return;
        }

        if (returnData.kind === "unknown-contract") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}', but it reverted with unknown error`,
          });
          return;
        }

        if (returnData.kind === "panic") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}', but it reverted with panic code ${returnData.code} (${returnData.description})`,
          });
          return;
        }

        if (returnData.kind === "error") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}', but it reverted with reason '${returnData.reason}'`,
          });
          return;
        }

        // this also doesn't work with overloaded errors
        if (returnData.name !== expectedCustomErrorName) {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}', but it reverted with custom error '${returnData.name}'`,
          });
          return;
        }

        if (!withArgs) {
          assert({
            condition: true,
            messageTrue: `Expected transaction NOT to be reverted with custom error '${expectedCustomErrorName}', but it was`,
          });
          return;
        }

        const argsAreEqual = matchArgs(withArgs, returnData.args);

        assert({
          condition: argsAreEqual,
          messageFalse: formatMatchError({
            msg: `Expected transaction to be reverted with custom error '${expectedCustomErrorName}' and matching arguments, but it was`,
            expected: withArgs,
            actual: returnData.args,
          }),
          messageTrue: `Expected transaction NOT to be reverted with custom error '${expectedCustomErrorName}' and matching arguments, but it was`,
        });
      };

      const derivedPromise = functionCall.promise.then(onSuccess, onError);

      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
