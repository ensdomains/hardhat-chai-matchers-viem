import { Address, isAddressEqual } from "viem";
import { TO_EQUAL_ADDRESS_MATCHER } from "./constants.js";
import { getObject } from "./utils.js";
import { addMethod } from "./utils/addMethod.js";

export function supportMisc(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
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
