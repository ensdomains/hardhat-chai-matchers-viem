import { getWithArgs, setWithArgs } from "./utils.js";

export function supportWithArgs(Assertion: Chai.AssertionStatic) {
  Assertion.addMethod(
    "withArgs",
    async function (this: Chai.AssertionStatic, ...args: unknown[]) {
      const existingArgs = getWithArgs(this);

      if (existingArgs)
        throw new Error("The `withArgs` matcher can only be used once");

      setWithArgs(this, args);

      return this;
    }
  );
}
