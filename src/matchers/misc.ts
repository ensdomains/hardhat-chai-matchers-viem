import { Address, isAddressEqual } from "viem";
import { TO_EQUAL_ADDRESS_MATCHER } from "./constants.js";
import { getObject } from "./utils.js";

export function supportMisc(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    TO_EQUAL_ADDRESS_MATCHER,
    function (this: Chai.AssertionStatic, expected: Address) {
      const actual = getObject(this);
      const equal = isAddressEqual(actual as Address, expected);

      return this.assert(
        equal,
        `expected ${actual} to equal address ${expected}`,
        `expected ${actual} not to equal address ${expected}`,
        expected,
        actual
      );
    }
  );
}
