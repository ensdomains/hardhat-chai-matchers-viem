import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployEvents } from "./fixtures.js";
import { expectAssertionError } from "./helpers.js";

describe("toEmitEvent", () => {
  it("test 1", async () => {
    const { events } = await loadFixture(deployEvents);
    await expect(events).write("emitUint", [1n]).toEmitEvent("WithUintArg");
  });
  it("test 2", async () => {
    const { events } = await loadFixture(deployEvents);
    await expect(events)
      .write("emitUint", [1n])
      .toEmitEvent("WithUintArg")
      .withArgs(1n);
  });
  it("test 2 - not", async () => {
    const { events } = await loadFixture(deployEvents);
    await expectAssertionError(
      expect(events)
        .write("emitUint", [1n])
        .not.toEmitEvent("WithUintArg")
        .withArgs(1n),
      'Expected event "WithUintArg" NOT to be emitted with matching arguments, but it was'
    );
  });
  it("test 3", async () => {
    const { events, anotherContract } = await loadFixture(deployEvents);

    await expect(events)
      .write("emitNestedUintFromAnotherContract", [1n])
      .toEmitEventFrom(anotherContract, "WithUintArg")
      .withArgs(1n);
  });
});
