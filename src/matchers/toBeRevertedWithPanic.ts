import { getKnownPanicReason } from "../constants.js";
import { TO_BE_REVERTED_WITH_PANIC_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { addMethod } from "./utils/addMethod.js";
import { buildAssert } from "./utils/buildAssert.js";
import { expectedLine, matcherHint, receivedLine } from "./utils/formatter.js";
import { getCall } from "./utils/getCall.js";
import {
  errorWhy,
  getReturnDataFromError,
} from "./utils/getReturnDataFromError.js";

const toBeRevertedWithPanicMessage = ({
  expectedCode,
  negated,
  why,
}: {
  expectedCode: bigint | undefined;
  negated: boolean;
  why: string;
}) => {
  const expectedString = `${negated ? "NOT " : ""}${
    expectedCode
      ? errorWhy.panic(expectedCode, getKnownPanicReason(expectedCode))
      : "transaction reverted with some panic code"
  }`;
  return [
    "",
    matcherHint({
      matcherName: `.${TO_BE_REVERTED_WITH_PANIC_MATCHER}`,
      expected: expectedCode ? `${expectedCode}` : "",
      isNot: negated,
    }),
    "",
    expectedLine(expectedString),
    receivedLine(why),
  ].join("\n");
};

export function supportRevertedWithPanic(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    TO_BE_REVERTED_WITH_PANIC_MATCHER,
    async function (
      this: Chai.AssertionStatic,
      expectedCode: bigint | undefined
    ) {
      const negated = getNegated(this);

      const functionCall = getCall(this, TO_BE_REVERTED_WITH_PANIC_MATCHER);
      const metadata = functionCall.__call_metadata;

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

      const onSuccess = async () => {
        const assert = buildAssert(chai, !!negated, onSuccess);
        const msg = toBeRevertedWithPanicMessage({
          expectedCode,
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

        const msg = toBeRevertedWithPanicMessage({
          expectedCode,
          negated,
          why: returnData.why,
        });

        assert({
          condition:
            returnData.kind === "panic" &&
            (!expectedCode || returnData.code === expectedCode),
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
