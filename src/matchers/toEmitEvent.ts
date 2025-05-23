import {
  Abi,
  AbiEvent,
  Address,
  decodeEventLog,
  getAddress,
  toEventSelector,
  type Hex,
  type PublicClient,
} from "viem";
import { getTransactionReceipt } from "viem/actions";

import {
  TO_EMIT_EVENT_FROM_MATCHER,
  TO_EMIT_EVENT_MATCHER,
} from "./constants.js";
import {
  getNegated,
  getWithArgs,
  preventAsyncMatcherChaining,
} from "./utils.js";
import { addMethod } from "./utils/addMethod.js";
import { assertIsNotNull } from "./utils/assertIsNotNull.js";
import { buildAssert } from "./utils/buildAssert.js";
import { formatArgs } from "./utils/formatArgs.js";
import {
  DIM_COLOR,
  expectedLine,
  matcherHint,
  receivedLine,
} from "./utils/formatter.js";
import { getCall } from "./utils/getCall.js";
import { getReturnDataFromError } from "./utils/getReturnDataFromError.js";
import { isValidTransactionHash } from "./utils/isValidTransactionHash.js";
import { matchArgs } from "./utils/matchArgs.js";

const toEmitEventMessage =
  ({
    eventName,
    expectedArgs,
    negated,
    matcherName,
  }: {
    eventName: string;
    expectedArgs: unknown[] | Record<string, unknown> | undefined;
    negated: boolean;
    matcherName: string;
  }) =>
  ({
    decodedLogs,
    why,
  }: {
    decodedLogs:
      | { eventName: string; args: unknown[] | undefined }[]
      | undefined;
    why: string | null;
  }) => {
    const separateContract = matcherName === TO_EMIT_EVENT_FROM_MATCHER;
    const targetEventSignature = `${
      separateContract ? "Contract." : ""
    }${eventName}(${formatArgs(expectedArgs)})`;
    const expectedString = `${negated ? "NOT " : ""}${targetEventSignature}`;
    return [
      "",
      matcherHint({
        matcherName: `.${matcherName}`,
        expected: `${separateContract ? "Contract, " : ""}${eventName}`,
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
      receivedLine(why === null ? targetEventSignature : why),
      ...(decodedLogs
        ? [
            "",
            DIM_COLOR("Decoded logs:"),
            ...decodedLogs.map((log) =>
              DIM_COLOR(`${log.eventName}(${formatArgs(log.args)})`)
            ),
          ]
        : []),
    ].join("\n");
  };

function toEmitEventWithCustomSubject(
  this: Chai.AssertionStatic,
  {
    metadata,
    expectedEventName,
    matcherName,
    chai,
  }: {
    metadata: { abi: Abi; address: Address; client: PublicClient };
    expectedEventName: string;
    matcherName: string;
    chai: Chai.ChaiStatic;
  }
) {
  const negated = getNegated(this);

  if (typeof expectedEventName !== "string")
    throw new TypeError(`Expected a string, but got '${expectedEventName}'`);

  const foundEvent = metadata.abi.find(
    (i): i is AbiEvent => i.type === "event" && i.name === expectedEventName
  );

  if (!foundEvent)
    throw new Error(
      `The event '${expectedEventName}' was not found in the contract ABI`
    );

  preventAsyncMatcherChaining(this, {
    matcherName,
    allowHashOnly: true,
  });

  const allEventSelectors = new Set<Hex>();
  for (const item of metadata.abi) {
    if (item.type === "event") allEventSelectors.add(toEventSelector(item));
  }
  const functionCall = getCall(this, matcherName);

  const onSuccess = async (value: unknown) => {
    if (!isValidTransactionHash(value))
      throw new TypeError(
        `Expected a valid transaction hash, but got '${value}'`
      );

    const assert = buildAssert(chai, !!negated, onSuccess);
    const withArgs = getWithArgs(this);
    const msg = toEmitEventMessage({
      eventName: expectedEventName,
      expectedArgs: withArgs,
      negated,
      matcherName,
    });

    const receipt = await getTransactionReceipt(metadata.client, {
      hash: value,
    });
    assertIsNotNull(receipt, "receipt");

    const checksummedAddress = getAddress(metadata.address);
    const exactMatchLogs: { eventName: string; args: unknown[] | undefined }[] =
      [];
    const partialMatchLogs: {
      eventName: string;
      args: unknown[] | undefined;
    }[] = [];
    const decodedLogs: { eventName: string; args: unknown[] | undefined }[] =
      [];
    for (const log of receipt.logs) {
      if (getAddress(log.address) !== checksummedAddress) continue;
      if (!log.topics[0]) continue;
      if (!allEventSelectors.has(log.topics[0])) continue;

      const decodedLog = decodeEventLog({ abi: metadata.abi, ...log }) as {
        eventName: string;
        args: unknown[] | undefined;
      };
      decodedLogs.push(decodedLog);
      if (decodedLog.eventName !== expectedEventName) continue;
      if (withArgs && !matchArgs(withArgs, decodedLog.args))
        partialMatchLogs.push(decodedLog);
      else exactMatchLogs.push(decodedLog);
    }
    assert({
      condition: exactMatchLogs.length > 0,
      messageFalse: msg({
        decodedLogs,
        why: partialMatchLogs.length > 0 ? "args mismatch" : "event missing",
      }),
      messageTrue: msg({
        decodedLogs: undefined,
        why: null,
      }),
    });
    return;
  };

  const onError = async (error: unknown) => {
    const assert = buildAssert(chai, !!negated, onError);
    const withArgs = getWithArgs(this);
    const msg = toEmitEventMessage({
      eventName: expectedEventName,
      expectedArgs: withArgs,
      negated,
      matcherName,
    });
    const returnData = getReturnDataFromError(metadata, error);

    if (returnData.kind === "unknown-local") throw error;

    assert({
      condition: false,
      messageFalse: msg({
        decodedLogs: undefined,
        why: returnData.why,
      }),
      solidityStack: returnData.sourceError?.stack,
    });
  };

  const derivedPromise = functionCall.then(onSuccess, onError);

  (this as any).then = derivedPromise.then.bind(derivedPromise);
  (this as any).catch = derivedPromise.catch.bind(derivedPromise);

  return this;
}

export function supportsEmitEvent(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    TO_EMIT_EVENT_MATCHER,
    function (this: Chai.AssertionStatic, expectedEventName: string) {
      const functionCall = getCall(this, TO_EMIT_EVENT_MATCHER);
      const metadata = functionCall.__call_metadata;

      return toEmitEventWithCustomSubject.call(this, {
        metadata,
        expectedEventName,
        matcherName: TO_EMIT_EVENT_MATCHER,
        chai,
      });
    }
  );

  addMethod(
    chai,
    TO_EMIT_EVENT_FROM_MATCHER,
    function (
      this: Chai.AssertionStatic,
      contract: unknown,
      expectedEventName: string
    ) {
      if (
        !contract ||
        typeof contract !== "object" ||
        !("abi" in contract) ||
        !("address" in contract)
      )
        throw new Error(
          "The `toEmitEventFrom` matcher can only be used with a contract"
        );

      const subject = contract as {
        abi: Abi;
        address: Address;
        client: PublicClient;
      };
      return toEmitEventWithCustomSubject.call(this, {
        metadata: subject,
        expectedEventName,
        matcherName: TO_EMIT_EVENT_FROM_MATCHER,
        chai,
      });
    }
  );
}
