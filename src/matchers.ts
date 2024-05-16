import { anyValueSymbol } from "./constants.js";
import { supportContract } from "./matchers/contract.js";
import { supportReverted } from "./matchers/toBeReverted.js";
import { supportRevertedWithCustomError } from "./matchers/toBeRevertedWithCustomError.js";
import { supportRevertedWithPanic } from "./matchers/toBeRevertedWithPanic.js";
import { supportRevertedWithString } from "./matchers/toBeRevertedWithString.js";
import { supportRevertedWithoutReason } from "./matchers/toBeRevertedWithoutReason.js";
import { supportsEmitEvent } from "./matchers/toEmitEvent.js";
import { supportWithArgs } from "./matchers/withArgs.js";

export const hardhatChaiMatchers = (
  chai: Chai.ChaiStatic,
  utils: Chai.ChaiUtils
) => {
  chai.expect.anyValue = anyValueSymbol;
  supportReverted(chai.Assertion);
  supportRevertedWithCustomError(chai.Assertion);
  supportRevertedWithoutReason(chai.Assertion);
  supportRevertedWithPanic(chai.Assertion);
  supportRevertedWithString(chai.Assertion);
  supportsEmitEvent(chai.Assertion);
  supportContract(chai.Assertion);
  supportWithArgs(chai.Assertion);
};
