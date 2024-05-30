import { Abi, AbiEvent, Address, decodeEventLog, toEventSelector } from "viem";
import {
  TO_EMIT_EVENT_FROM_MATCHER,
  TO_EMIT_EVENT_MATCHER,
} from "./constants.js";
import {
  getNegated,
  getWithArgs,
  preventAsyncMatcherChaining,
} from "./utils.js";
import { assertIsNotNull } from "./utils/assertIsNotNull.js";
import { buildAssert } from "./utils/buildAssert.js";
import { getCall } from "./utils/getCallFlag.js";
import { getTransactionReceipt } from "./utils/getTransactionReceipt.js";
import { isValidTransactionHash } from "./utils/isValidTransactionHash.js";
import { matchArgs, withAnyValue } from "./utils/matchArgs.js";

function toEmitEventWithCustomSubject(
  this: Chai.AssertionStatic,
  {
    subject,
    expectedEventName,
    matcherName,
  }: {
    subject: { abi: Abi; address: Address };
    expectedEventName: string;
    matcherName: string;
  }
) {
  const negated = getNegated(this);

  if (typeof expectedEventName !== "string")
    throw new TypeError(`Expected a string, but got '${expectedEventName}'`);

  const foundEvent = subject.abi.find(
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

  const eventSignature = toEventSelector(foundEvent);
  const functionCall = getCall(this, matcherName);

  const onSuccess = async (value: unknown) => {
    if (!isValidTransactionHash(value))
      throw new TypeError(
        `Expected a valid transaction hash, but got '${value}'`
      );

    const assert = buildAssert(!!negated, onSuccess);
    const withArgs = getWithArgs(this);

    const receipt = await getTransactionReceipt(value);
    assertIsNotNull(receipt, "receipt");

    const matchingLogs = receipt.logs.filter(
      (log) =>
        log.address === subject.address && log.topics[0] === eventSignature
    );

    if (!withArgs || !matchingLogs.length) {
      assert({
        condition: matchingLogs.length > 0,
        messageFalse: `Expected event "${expectedEventName}" to be emitted, but it wasn't`,
        messageTrue: `Expected event "${expectedEventName}" NOT to be emitted, but it was`,
      });
      return;
    }

    const decodedLogs = matchingLogs.map((log) =>
      decodeEventLog({ abi: subject.abi, ...log })
    );
    const matchedLog = decodedLogs.find((log) => matchArgs(withArgs, log.args));

    if (decodedLogs.length === 1) {
      withAnyValue(withArgs, decodedLogs[0].args);
      this.assert(
        !matchedLog,
        `Expected event '${expectedEventName}' to have args matching #{exp}`,
        `Expected event '${expectedEventName}' NOT to have args matching #{exp}`,
        withArgs,
        decodedLogs[0].args
      );
      return;
    }

    this.assert(
      !matchedLog,
      `Expected event '${expectedEventName}' to have args matching #{exp}. ${decodedLogs.length} "${expectedEventName}" events were emitted, but none of them matched the specified arguments`,
      `Expected event '${expectedEventName}' NOT to have args matching #{exp}`,
      withArgs
    );
    return;
  };

  const onError = async () => {
    const assert = buildAssert(!!negated, onError);

    assert({
      condition: false,
      messageFalse: `Expected event "${expectedEventName}" to be emitted, but the transaction reverted`,
    });
  };

  const derivedPromise = functionCall.promise.then(onSuccess, onError);

  (this as any).then = derivedPromise.then.bind(derivedPromise);
  (this as any).catch = derivedPromise.catch.bind(derivedPromise);

  return this;
}

export function supportsEmitEvent(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TO_EMIT_EVENT_MATCHER,
    function (this: Chai.AssertionStatic, expectedEventName: string) {
      const subject: { abi: Abi; address: Address } = this._obj;
      return toEmitEventWithCustomSubject.call(this, {
        subject,
        expectedEventName,
        matcherName: TO_EMIT_EVENT_MATCHER,
      });
    }
  );

  Assertion.addMethod(
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

      const subject = contract as { abi: Abi; address: Address };
      return toEmitEventWithCustomSubject.call(this, {
        subject,
        expectedEventName,
        matcherName: TO_EMIT_EVENT_FROM_MATCHER,
      });
    }
  );
}
