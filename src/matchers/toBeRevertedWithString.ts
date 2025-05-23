import { TO_BE_REVERTED_WITH_STRING_MATCHER } from "./constants.js";
import { getNegated, preventAsyncMatcherChaining } from "./utils.js";
import { addMethod } from "./utils/addMethod.js";
import { buildAssert } from "./utils/buildAssert.js";
import { expectedLine, matcherHint, receivedLine } from "./utils/formatter.js";
import { getCall } from "./utils/getCall.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";

const toBeRevertedWithStringMessage = ({
  expectedReasonString,
  isRegExp,
  negated,
  why,
}: {
  expectedReasonString: string;
  isRegExp: boolean;
  negated: boolean;
  why: string;
}) => {
  const expectedString = `${
    negated ? "NOT " : ""
  }transaction reverted with string: ${
    isRegExp ? `matching ${expectedReasonString}` : expectedReasonString
  }`;
  return [
    "",
    matcherHint({
      matcherName: `.${TO_BE_REVERTED_WITH_STRING_MATCHER}`,
      expected: `${
        isRegExp ? expectedReasonString : `"${expectedReasonString}"`
      }`,
      isNot: negated,
    }),
    "",
    expectedLine(expectedString),
    receivedLine(why),
  ].join("\n");
};

export function supportRevertedWithString(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    TO_BE_REVERTED_WITH_STRING_MATCHER,
    async function (
      this: Chai.AssertionStatic,
      expectedReason: string | RegExp
    ) {
      const negated = getNegated(this);

      const functionCall = getCall(this, TO_BE_REVERTED_WITH_STRING_MATCHER);
      const metadata = functionCall.__call_metadata;

      const isRegExp = expectedReason instanceof RegExp;

      if (!isRegExp && typeof expectedReason !== "string")
        throw new TypeError(
          `Expected a string or a regular expression, but got '${expectedReason}'`
        );

      preventAsyncMatcherChaining(this, {
        matcherName: TO_BE_REVERTED_WITH_STRING_MATCHER,
      });

      const expectedReasonString = isRegExp
        ? `/${expectedReason.source}/${expectedReason.flags}`
        : expectedReason;

      const onSuccess = async () => {
        const assert = buildAssert(chai, !!negated, onSuccess);
        const msg = toBeRevertedWithStringMessage({
          expectedReasonString,
          isRegExp,
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

        const msg = toBeRevertedWithStringMessage({
          expectedReasonString,
          isRegExp,
          negated,
          why: returnData.why,
        });

        assert({
          condition:
            returnData.kind === "error" &&
            (expectedReason instanceof RegExp
              ? expectedReason.test(returnData.reason)
              : expectedReason === returnData.reason),
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
