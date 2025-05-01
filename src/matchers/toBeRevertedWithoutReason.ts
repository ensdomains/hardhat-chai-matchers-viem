import { TO_BE_REVERTED_WITHOUT_REASON_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { buildAssert } from "./utils/buildAssert.js";
import { getCall } from "./utils/getCall.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";

export function supportRevertedWithoutReason(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TO_BE_REVERTED_WITHOUT_REASON_MATCHER,
    async function (this: Chai.AssertionStatic) {
      const negated = getNegated(this);

      const functionCall = getCall(this, TO_BE_REVERTED_WITHOUT_REASON_MATCHER);
      const metadata = functionCall.__call_metadata;

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_WITHOUT_REASON_MATCHER,
      });

      const onSuccess = async () => {
        const assert = buildAssert(!!negated, onSuccess);

        assert({
          condition: false,
          messageFalse: `Expected transaction to be reverted without a reason, but it didn't revert`,
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(!!negated, onError);
        const returnData = getReturnDataFromError(metadata, error);

        if (returnData.kind === "unknown-local") throw error;

        if (returnData.kind === "unknown-contract") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted without a reason, but it reverted with unknown error`,
          });
          return;
        }

        if (returnData.kind === "panic") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted without a reason, but it reverted with panic code ${returnData.code} (${returnData.description})`,
          });
          return;
        }

        if (returnData.kind === "error") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted without a reason, but it reverted with error '${returnData.reason}'`,
          });
          return;
        }

        if (returnData.kind === "custom") {
          assert({
            condition: false,
            messageFalse: `Expected transaction to be reverted without a reason, but it reverted with custom error '${returnData.name}'`,
          });
          return;
        }

        assert({
          condition: true,
          messageTrue: `Expected transaction NOT to be reverted without a reason, but it was`,
        });
      };

      const derivedPromise = functionCall.then(onSuccess, onError);

      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
