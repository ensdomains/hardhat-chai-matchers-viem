import { Abi } from "viem";
import { getKnownPanicReason } from "../constants.js";
import { TO_BE_REVERTED_WITH_PANIC_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { buildAssert } from "./utils/buildAssert.js";
import { getCall } from "./utils/getCallFlag.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";

export function supportRevertedWithPanic(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TO_BE_REVERTED_WITH_PANIC_MATCHER,
    async function (
      this: Chai.AssertionStatic,
      expectedCode: bigint | undefined
    ) {
      const negated = getNegated(this);

      const subject: { abi: Abi } = this._obj;

      if (
        typeof expectedCode !== "bigint" &&
        typeof expectedCode !== "undefined"
      )
        throw new TypeError(
          `Expected a bigint or undefined, but got '${expectedCode}'`
        );

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_WITH_PANIC_MATCHER,
      });

      const functionCall = getCall(this, TO_BE_REVERTED_WITH_PANIC_MATCHER);

      const formattedExpectedCode = expectedCode
        ? (`panic code ${expectedCode} (${getKnownPanicReason(
            expectedCode
          )})` as const)
        : ("some panic code" as const);

      const onSuccess = async () => {
        const assert = buildAssert(!!negated, onSuccess);

        assert({
          condition: false,
          messageFalse: `Expected transaction to be reverted with ${formattedExpectedCode}, but it didn't revert`,
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(!!negated, onError);
        const returnData = getReturnDataFromError(subject, error);

        if (returnData.kind === "unknown-local") throw error;

        if (returnData.kind === "empty") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with ${formattedExpectedCode}, but it reverted without a reason`,
          });
          return;
        }

        if (returnData.kind === "unknown-contract") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with ${formattedExpectedCode}, but it reverted with unknown error`,
          });
          return;
        }

        if (returnData.kind === "error") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with ${formattedExpectedCode}, but it reverted with reason '${returnData.reason}'`,
          });
          return;
        }

        if (returnData.kind === "custom") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted with ${formattedExpectedCode}, but it reverted with custom error '${returnData.name}'`,
          });
          return;
        }

        if (expectedCode !== undefined) {
          assert({
            condition: returnData.code === expectedCode,
            messageFalse: `Expected transaction to be reverted with ${formattedExpectedCode}, but it reverted with panic code ${returnData.code} (${returnData.description})`,
            messageTrue: `Expected transaction NOT to be reverted with ${formattedExpectedCode}, but it was`,
          });
          return;
        }

        assert({
          condition: true,
          messageTrue: `Expected transaction NOT to be reverted with ${formattedExpectedCode}, but it reverted with panic code ${returnData.code} (${returnData.description})`,
        });
      };

      const derivedPromise = functionCall.promise.then(onSuccess, onError);

      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
