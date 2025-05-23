import { supportMisc } from "./matchers/misc.js";
import { supportReverted } from "./matchers/toBeReverted.js";
import { supportRevertedWithCustomError } from "./matchers/toBeRevertedWithCustomError.js";
import { supportRevertedWithPanic } from "./matchers/toBeRevertedWithPanic.js";
import { supportRevertedWithString } from "./matchers/toBeRevertedWithString.js";
import { supportRevertedWithoutReason } from "./matchers/toBeRevertedWithoutReason.js";
import { supportsEmitEvent } from "./matchers/toEmitEvent.js";
import { supportWithArgs } from "./matchers/withArgs.js";

export const hardhatChaiMatchers = (
  chai: Chai.ChaiStatic,
  _utils: Chai.ChaiUtils
) => {
  supportReverted(chai);
  supportRevertedWithCustomError(chai);
  supportRevertedWithoutReason(chai);
  supportRevertedWithPanic(chai);
  supportRevertedWithString(chai);
  supportsEmitEvent(chai);
  supportWithArgs(chai);
  supportMisc(chai);
};
