import { Abi } from "viem";
import { TO_BE_REVERTED_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { assertIsNotNull } from "./utils/assertIsNotNull.js";
import { buildAssert } from "./utils/buildAssert.js";
import { getCall } from "./utils/getCallFlag.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";
import { getTransactionReceipt } from "./utils/getTransactionReceipt.js";
import { isValidTransactionHash } from "./utils/isValidTransactionHash.js";

export function supportReverted(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TO_BE_REVERTED_MATCHER,
    async function (this: Chai.AssertionStatic) {
      const negated = getNegated(this);

      const subject: { abi: Abi } = this._obj;

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_MATCHER,
      });

      const functionCall = getCall(this, TO_BE_REVERTED_MATCHER);

      const onSuccess = async (value: unknown) => {
        const assert = buildAssert(!!negated, onSuccess);

        if (functionCall.kind === "read") {
          assert({
            condition: false,
            messageFalse: "Expected transaction to be reverted",
            messageTrue: "Expected transaction NOT to be reverted",
          });
          return;
        }

        if (!isValidTransactionHash(value))
          throw new TypeError(
            `Expected a valid transaction hash, but got '${value}'`
          );

        const receipt = await getTransactionReceipt(value);
        assertIsNotNull(receipt, "receipt");
        assert({
          condition: receipt.status === "reverted",
          messageFalse: "Expected transaction to be reverted",
          messageTrue: "Expected transaction NOT to be reverted",
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(!!negated, onError);
        const returnData = getReturnDataFromError(subject, error);

        if (returnData.kind === "unknown-local") throw error;

        if (returnData.kind === "empty") {
          assert({
            condition: true,
            messageTrue: "Expected transaction NOT to be reverted",
          });
          return;
        }

        if (returnData.kind === "unknown-contract") {
          assert({
            condition: true,
            messageTrue: `Expected transaction NOT to be reverted, but it reverted with unknown error`,
          });
          return;
        }

        if (returnData.kind === "panic") {
          assert({
            condition: true,
            messageTrue: `Expected transaction NOT to be reverted, but it reverted with panic code ${returnData.code} (${returnData.description})`,
          });
          return;
        }

        if (returnData.kind === "error") {
          assert({
            condition: true,
            messageTrue: `Expected transaction NOT to be reverted, but it reverted with reason '${returnData.reason}'`,
          });
          return;
        }

        assert({
          condition: true,
          messageTrue: `Expected transaction NOT to be reverted, but it reverted with custom error '${returnData.name}'`,
        });
      };

      const derivedPromise = functionCall.promise.then(onSuccess, onError);

      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
