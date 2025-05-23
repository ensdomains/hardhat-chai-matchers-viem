import { AbiError } from "abitype";
import type { Abi, Address, PublicClient } from "viem";

import {
  TO_BE_REVERTED_WITH_CUSTOM_ERROR_FROM_MATCHER,
  TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER,
} from "./constants.js";
import {
  getNegated,
  getWithArgs,
  preventAsyncMatcherChaining,
} from "./utils.js";
import { addMethod } from "./utils/addMethod.js";
import { buildAssert } from "./utils/buildAssert.js";
import { formatArgs } from "./utils/formatArgs.js";
import { expectedLine, matcherHint, receivedLine } from "./utils/formatter.js";
import { getCall } from "./utils/getCall.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";
import { matchArgs } from "./utils/matchArgs.js";

const toBeRevertedWithCustomErrorMessage =
  ({
    expectedArgs,
    expectedCustomErrorName,
    negated,
    matcherName,
  }: {
    expectedArgs: unknown[] | undefined;
    expectedCustomErrorName: string;
    negated: boolean;
    matcherName: string;
  }) =>
  ({
    receivedArgs,
    why,
  }: {
    receivedArgs: readonly unknown[] | undefined;
    why: string | null;
  }) => {
    const separateContract =
      matcherName === TO_BE_REVERTED_WITH_CUSTOM_ERROR_FROM_MATCHER;
    const targetErrorSignature = `${
      separateContract ? "Contract." : ""
    }${expectedCustomErrorName}(${formatArgs(expectedArgs)})`;
    const expectedString = `${negated ? "NOT " : ""}${targetErrorSignature}`;
    const receivedString = (() => {
      if (why === null) return targetErrorSignature;
      if (receivedArgs) return `${why}(${formatArgs(receivedArgs)})`;
      return why;
    })();
    return [
      "",
      matcherHint({
        matcherName: `.${matcherName}`,
        expected: `${
          separateContract ? "Contract, " : ""
        }${expectedCustomErrorName}`,
        isNot: negated,
        ...(expectedArgs
          ? {
              chainedMatcher: {
                matcherName: ".withArgs",
                expected: formatArgs(expectedArgs),
              },
            }
          : {}),
      }),
      "",
      expectedLine(expectedString),
      receivedLine(receivedString),
    ].join("\n");
  };

function toBeRevertedWithCustomErrorWithCustomSubject(
  this: Chai.AssertionStatic,
  {
    metadata,
    expectedCustomErrorName,
    matcherName,
    chai,
  }: {
    metadata: { abi: Abi; address: Address; client: PublicClient };
    expectedCustomErrorName: string;
    matcherName: string;
    chai: Chai.ChaiStatic;
  }
) {
  const negated = getNegated(this);
  const functionCall = getCall(this, matcherName);

  if (typeof expectedCustomErrorName !== "string")
    throw new TypeError(
      `Expected a string, but got '${expectedCustomErrorName}'`
    );

  // this doesn't work with overloaded errors
  const foundError = metadata.abi.find(
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

  const onSuccess = async () => {
    const assert = buildAssert(chai, !!negated, onSuccess);
    const withArgs = getWithArgs<unknown[]>(this);
    const msg = toBeRevertedWithCustomErrorMessage({
      expectedArgs: withArgs,
      expectedCustomErrorName,
      negated,
      matcherName,
    });

    assert({
      condition: false,
      messageFalse: msg({
        receivedArgs: undefined,
        why: "no revert",
      }),
    });
  };

  const onError = (error: unknown) => {
    const assert = buildAssert(chai, !!negated, onError);
    const returnData = getReturnDataFromError(metadata, error);

    const withArgs = getWithArgs<unknown[]>(this);
    const msg = toBeRevertedWithCustomErrorMessage({
      expectedArgs: withArgs,
      expectedCustomErrorName,
      negated,
      matcherName,
    });

    if (returnData.kind === "unknown-local") throw error;

    if (returnData.kind !== "custom") {
      assert({
        condition: false,
        messageFalse: msg({
          receivedArgs: undefined,
          why: returnData.why,
        }),
      });
      return;
    }

    assert({
      condition:
        returnData.name === expectedCustomErrorName &&
        (!withArgs || matchArgs(withArgs, returnData.args)),
      messageFalse: msg({
        receivedArgs: returnData.args,
        why: returnData.name,
      }),
      messageTrue: msg({
        receivedArgs: undefined,
        why: null,
      }),
    });
    return;
  };

  const derivedPromise = functionCall.then(onSuccess, onError);

  (this as any).then = derivedPromise.then.bind(derivedPromise);
  (this as any).catch = derivedPromise.catch.bind(derivedPromise);

  return this;
}

export function supportRevertedWithCustomError(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER,
    function (this: Chai.AssertionStatic, expectedCustomErrorName: string) {
      const functionCall = getCall(
        this,
        TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER
      );
      const metadata = functionCall.__call_metadata;

      return toBeRevertedWithCustomErrorWithCustomSubject.call(this, {
        metadata,
        expectedCustomErrorName,
        matcherName: TO_BE_REVERTED_WITH_CUSTOM_ERROR_MATCHER,
        chai,
      });
    }
  );

  addMethod(
    chai,
    TO_BE_REVERTED_WITH_CUSTOM_ERROR_FROM_MATCHER,
    function (
      this: Chai.AssertionStatic,
      contract: unknown,
      expectedCustomErrorName: string
    ) {
      if (
        !contract ||
        typeof contract !== "object" ||
        !("abi" in contract) ||
        !("address" in contract)
      )
        throw new Error(
          "The `toBeRevertedWithCustomErrorFrom` matcher can only be used with a contract"
        );

      const subject = contract as {
        abi: Abi;
        address: Address;
        client: PublicClient;
      };
      return toBeRevertedWithCustomErrorWithCustomSubject.call(this, {
        metadata: subject,
        expectedCustomErrorName,
        matcherName: TO_BE_REVERTED_WITH_CUSTOM_ERROR_FROM_MATCHER,
        chai,
      });
    }
  );
}
