import { expect } from "chai";
import hre from "hardhat";
import { describe, it } from "vitest";

import { createDeployEventsFixture } from "./fixtures.js";
import { createFixture, expectAssertionError } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadEventsFixture = createFixture(
  networkConnection,
  createDeployEventsFixture
);

describe("toEmitEvent", () => {
  it("test 1", async () => {
    const { events } = await loadEventsFixture();
    await expect(events.write.emitUint([1n])).toEmitEvent("WithUintArg");
  });
  it("test 2", async () => {
    const { events } = await loadEventsFixture();
    await expect(events.write.emitUint([1n]))
      .toEmitEvent("WithUintArg")
      .withArgs(1n);
  });
  it("test 2 - not", async () => {
    const { events } = await loadEventsFixture();
    await expectAssertionError(
      expect(events.write.emitUint([1n]))
        .not.toEmitEvent("WithUintArg")
        .withArgs(1n),
      "Expected event 'WithUintArg' NOT to have args matching [ 1n ]"
    );
  });
  it("test 3", async () => {
    const { events, anotherContract } = await loadEventsFixture();

    await expect(events.write.emitNestedUintFromAnotherContract([1n]))
      .toEmitEventFrom(anotherContract, "WithUintArg")
      .withArgs(1n);
  });
  // it("hash only", async () => {
  //   const { events } = await loadEventsFixture();

  //   const hash = await events.write.emitUint([1n]);

  //   await expect(hash).toEmitEvent("WithUintArg").withArgs(1n);
  // });
  it("promise", async () => {
    const { events } = await loadEventsFixture();

    const promise = events.write.emitUint([1n]);

    await expect(promise).toEmitEvent("WithUintArg").withArgs(1n);
  });

  it("two events", async () => {
    const { events } = await loadEventsFixture();

    const tx = events.write.emitUintTwice([1n, 2n]);

    await expect(tx).toEmitEvent("WithUintArg").withArgs(1n);

    await expect(tx).toEmitEvent("WithUintArg").withArgs(2n);
  });

  it("two events - not", async () => {
    const { events } = await loadEventsFixture();

    const tx = events.write.emitUintTwice([1n, 2n]);

    await expectAssertionError(
      expect(tx).not.toEmitEvent("WithUintArg").withArgs(1n),
      "Expected event 'WithUintArg' NOT to have args matching [ 1n ]"
    );

    await expectAssertionError(
      expect(tx).not.toEmitEvent("WithUintArg").withArgs(2n),
      "Expected event 'WithUintArg' NOT to have args matching [ 2n ]"
    );
  });
});
