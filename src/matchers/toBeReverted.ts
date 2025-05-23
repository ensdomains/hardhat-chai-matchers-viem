import { getTransactionReceipt } from "viem/actions";

import { TO_BE_REVERTED_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { addMethod } from "./utils/addMethod.js";
import { assertIsNotNull } from "./utils/assertIsNotNull.js";
import { buildAssert } from "./utils/buildAssert.js";
import { expectedLine, matcherHint, receivedLine } from "./utils/formatter.js";
import { getCall } from "./utils/getCall.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";
import { isValidTransactionHash } from "./utils/isValidTransactionHash.js";

const toBeRevertedMessage =
  ({ negated }: { negated: boolean }) =>
  ({ why }: { why: string }) => {
    return [
      "",
      matcherHint({
        matcherName: `.${TO_BE_REVERTED_MATCHER}`,
        expected: "",
        isNot: negated,
      }),
      "",
      expectedLine(negated ? "no revert" : "revert"),
      receivedLine(why),
    ].join("\n");
  };

export function supportReverted(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    TO_BE_REVERTED_MATCHER,
    async function (this: Chai.AssertionStatic) {
      const negated = getNegated(this);

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_MATCHER,
      });

      const functionCall = getCall(this, TO_BE_REVERTED_MATCHER);
      const metadata = functionCall.__call_metadata;

      const onSuccess = async (value: unknown) => {
        const assert = buildAssert(chai, !!negated, onSuccess);
        const msg = toBeRevertedMessage({ negated });
        const messageFalse = msg({ why: "no revert" });
        const messageTrue = msg({ why: "revert" });

        if (metadata.kind === "read") {
          assert({
            condition: false,
            messageFalse,
            messageTrue,
          });
          return;
        }

        if (!isValidTransactionHash(value))
          throw new TypeError(
            `Expected a valid transaction hash, but got '${value}'`
          );

        const receipt = await getTransactionReceipt(metadata.client, {
          hash: value,
        });
        assertIsNotNull(receipt, "receipt");
        assert({
          condition: receipt.status === "reverted",
          messageFalse,
          messageTrue,
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(chai, !!negated, onError);
        const msg = toBeRevertedMessage({ negated });
        const returnData = getReturnDataFromError(metadata, error);

        if (returnData.kind === "unknown-local") throw error;

        assert({
          condition: true,
          messageTrue: msg({ why: returnData.why }),
          solidityStack: returnData.sourceError?.stack,
        });
        return;
      };

      const derivedPromise = functionCall.then(onSuccess, onError);

      (this as any).then = derivedPromise.then.bind(derivedPromise);
      (this as any).catch = derivedPromise.catch.bind(derivedPromise);

      return this;
    }
  );
}
