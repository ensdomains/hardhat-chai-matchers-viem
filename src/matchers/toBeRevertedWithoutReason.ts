import { TO_BE_REVERTED_WITHOUT_REASON_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { addMethod } from "./utils/addMethod.js";
import { buildAssert } from "./utils/buildAssert.js";
import { expectedLine, matcherHint, receivedLine } from "./utils/formatter.js";
import { getCall } from "./utils/getCall.js";
import {
  errorWhy,
  getReturnDataFromError,
} from "./utils/getReturnDataFromError.js";

const toBeRevertedWithoutReasonMessage = ({
  negated,
  why,
}: {
  negated: boolean;
  why: string;
}) => {
  return [
    "",
    matcherHint({
      matcherName: `.${TO_BE_REVERTED_WITHOUT_REASON_MATCHER}`,
      expected: "",
      isNot: negated,
    }),
    "",
    expectedLine(`${negated ? "not " : ""}${errorWhy.empty}`),
    receivedLine(why),
  ].join("\n");
};

export function supportRevertedWithoutReason(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    TO_BE_REVERTED_WITHOUT_REASON_MATCHER,
    async function (this: Chai.AssertionStatic) {
      const negated = getNegated(this);

      const functionCall = getCall(this, TO_BE_REVERTED_WITHOUT_REASON_MATCHER);
      const metadata = functionCall.__call_metadata;

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_WITHOUT_REASON_MATCHER,
      });

      const onSuccess = async () => {
        const assert = buildAssert(chai, !!negated, onSuccess);
        const msg = toBeRevertedWithoutReasonMessage({
          negated,
          why: "no revert",
        });

        assert({
          condition: false,
          messageFalse: msg,
        });
      };

      const onError = (error: unknown) => {
        const assert = buildAssert(chai, !!negated, onError);
        const returnData = getReturnDataFromError(metadata, error);

        if (returnData.kind === "unknown-local") throw error;

        const msg = toBeRevertedWithoutReasonMessage({
          negated,
          why: returnData.why,
        });

        assert({
          condition: returnData.kind === "empty",
          messageFalse: msg,
          messageTrue: msg,
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
