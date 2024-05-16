import { Abi } from "viem";
import { TO_BE_REVERTED_WITH_STRING_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { buildAssert } from "./utils/buildAssert.js";
import { getCall } from "./utils/getCallFlag.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";

export function supportRevertedWithString(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TO_BE_REVERTED_WITH_STRING_MATCHER,
    async function (
      this: Chai.AssertionStatic,
      expectedReason: string | RegExp
    ) {
      const negated = getNegated(this);

      const subject: { abi: Abi } = this._obj;

      if (
        !(expectedReason instanceof RegExp) &&
        typeof expectedReason !== "string"
      )
        throw new TypeError(
          `Expected a string or a regular expression, but got '${expectedReason}'`
        );

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_WITH_STRING_MATCHER,
      });

      const functionCall = getCall(this, TO_BE_REVERTED_WITH_STRING_MATCHER);
      const expectedReasonString =
        expectedReason instanceof RegExp
          ? expectedReason.source
          : expectedReason;

      const onSuccess = async () => {
        const assert = buildAssert(!!negated, onSuccess);

        assert({
          condition: false,
          messageFalse: `Expected transaction to be reverted with reason '${expectedReasonString}', but it didn't revert`,
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(!!negated, onError);
        const returnData = getReturnDataFromError(subject, error);

        if (returnData.kind === "unknown-local") throw error;

        if (returnData.kind === "empty") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with reason '${expectedReasonString}', but it reverted without a reason`,
          });
          return;
        }

        if (returnData.kind === "unknown-contract") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with reason '${expectedReasonString}', but it reverted with unknown error`,
          });
          return;
        }

        if (returnData.kind === "panic") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with reason '${expectedReasonString}', but it reverted with panic code ${returnData.code} (${returnData.description})`,
          });
          return;
        }

        if (returnData.kind === "custom") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with reason '${expectedReasonString}', but it reverted with custom error '${returnData.name}'`,
          });
          return;
        }

        const matchesExpectedReason =
          expectedReason instanceof RegExp
            ? expectedReason.test(returnData.reason)
            : expectedReason === returnData.reason;
        assert({
          condition: matchesExpectedReason,
          messageFalse: `Expected transaction to be reverted with reason '${expectedReasonString}', but it reverted with reason '${returnData.reason}'`,
          messageTrue: `Expected transaction NOT to be reverted with reason '${expectedReasonString}', but it was`,
        });
      };

      const derivedPromise = functionCall.promise.then(onSuccess, onError);

      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
