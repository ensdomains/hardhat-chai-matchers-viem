import { getWithArgs, setWithArgs } from "./utils.js";
import { addMethod } from "./utils/addMethod.js";

export function supportWithArgs(chai: Chai.ChaiStatic) {
  addMethod(
    chai,
    "withArgs",
    async function (
      this: Chai.AssertionStatic,
      args: unknown[] | Record<string, unknown>
    ) {
      const existingArgs = getWithArgs(this);

      if (existingArgs)
        throw new Error("The `withArgs` matcher can only be used once");

      setWithArgs(this, args);

      return this;
    }
  );
}
