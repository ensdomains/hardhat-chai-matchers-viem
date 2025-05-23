import hre from "hardhat";
import { describe, expect, test } from "vitest";

import { createDeployEventsFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadEventsFixture = createFixture(
  networkConnection,
  createDeployEventsFixture
);

describe("toEmitEvent", () => {
  test("single event without args", async () => {
    const { events } = await loadEventsFixture();
    await expect(events.write.emitUint([1n])).toEmitEvent("WithUintArg");
  });

  test("single event with args", async () => {
    const { events } = await loadEventsFixture();
    await expect(events.write.emitUint([1n]))
      .toEmitEvent("WithUintArg")
      .withArgs({ u: 1n });
  });

  test("single event without args from another contract", async () => {
    const { events, anotherEventsContract } = await loadEventsFixture();
    await expect(
      events.write.emitNestedUintFromAnotherContract([1n])
    ).toEmitEventFrom(anotherEventsContract, "WithUintArg");
  });

  test("single event with args from another contract", async () => {
    const { events, anotherEventsContract } = await loadEventsFixture();
    await expect(events.write.emitNestedUintFromAnotherContract([1n]))
      .toEmitEventFrom(anotherEventsContract, "WithUintArg")
      .withArgs({ u: 1n });
  });

  test("promise", async () => {
    const { events } = await loadEventsFixture();

    const promise = events.write.emitUint([1n]);

    await expect(promise).toEmitEvent("WithUintArg").withArgs({ u: 1n });
  });

  test("two events", async () => {
    const { events } = await loadEventsFixture();

    const tx = events.write.emitUintTwice([1n, 2n]);

    await expect(tx).toEmitEvent("WithUintArg").withArgs({ u: 1n });

    await expect(tx).toEmitEvent("WithUintArg").withArgs({ u: 2n });
  });

  describe("negated", () => {
    test("single event without args", async () => {
      const { events } = await loadEventsFixture();
      await expect(
        expect(events.write.emitUint([1n])).not.toEmitEvent("WithUintArg")
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).not.toEmitEvent(WithUintArg)

        Expected: "NOT WithUintArg()"
        Received: "WithUintArg()"]
      `);
    });

    test("single event with args", async () => {
      const { events } = await loadEventsFixture();
      await expect(
        expect(events.write.emitUint([1n]))
          .not.toEmitEvent("WithUintArg")
          .withArgs({ u: 1n })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).not.toEmitEvent(WithUintArg).withArgs(u=1)

        Expected: "NOT WithUintArg(u=1)"
        Received: "WithUintArg(u=1)"]
      `);
    });

    test("single event without args from another contract", async () => {
      const { events, anotherEventsContract } = await loadEventsFixture();
      await expect(
        expect(
          events.write.emitNestedUintFromAnotherContract([1n])
        ).not.toEmitEventFrom(anotherEventsContract, "WithUintArg")
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).not.toEmitEventFrom(Contract, WithUintArg)

        Expected: "NOT Contract.WithUintArg()"
        Received: "Contract.WithUintArg()"]
      `);
    });

    test("single event with args from another contract", async () => {
      const { events, anotherEventsContract } = await loadEventsFixture();
      await expect(
        expect(events.write.emitNestedUintFromAnotherContract([1n]))
          .not.toEmitEventFrom(anotherEventsContract, "WithUintArg")
          .withArgs({ u: 1n })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).not.toEmitEventFrom(Contract, WithUintArg).withArgs(u=1)

        Expected: "NOT Contract.WithUintArg(u=1)"
        Received: "Contract.WithUintArg(u=1)"]
      `);
    });

    test("two events", async () => {
      const { events } = await loadEventsFixture();

      const tx = events.write.emitUintTwice([1n, 2n]);

      await expect(
        expect(tx).not.toEmitEvent("WithUintArg").withArgs({ u: 1n })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).not.toEmitEvent(WithUintArg).withArgs(u=1)

        Expected: "NOT WithUintArg(u=1)"
        Received: "WithUintArg(u=1)"]
      `);

      await expect(
        expect(tx).not.toEmitEvent("WithUintArg").withArgs({ u: 2n })
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).not.toEmitEvent(WithUintArg).withArgs(u=2)

        Expected: "NOT WithUintArg(u=2)"
        Received: "WithUintArg(u=2)"]
      `);
    });
  });

  describe("unnamed args", () => {
    test("single arg", async () => {
      const { events } = await loadEventsFixture();

      await expect(events.write.emitUnnamedString(["foo"]))
        .toEmitEvent("WithUnnamedStringArg")
        .withArgs(["foo"]);
    });
    test("multiple args", async () => {
      const { events } = await loadEventsFixture();

      await expect(events.write.emitTwoUnnamedStrings(["foo", "bar"]))
        .toEmitEvent("WithTwoUnnamedStringArgs")
        .withArgs(["foo", "bar"]);
    });
    test("out of order args", async () => {
      const { events } = await loadEventsFixture();

      await expect(
        expect(events.write.emitTwoUnnamedStrings(["foo", "bar"]))
          .toEmitEvent("WithTwoUnnamedStringArgs")
          .withArgs(["bar", "foo"])
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toEmitEvent(WithTwoUnnamedStringArgs).withArgs(bar, foo)

        Expected: "WithTwoUnnamedStringArgs(bar, foo)"
        Received: "args mismatch"

        Decoded logs:
        WithTwoUnnamedStringArgs(foo, bar)]
      `);
    });
    describe("negated", () => {
      test("single arg", async () => {
        const { events } = await loadEventsFixture();

        await expect(
          expect(events.write.emitUnnamedString(["foo"]))
            .not.toEmitEvent("WithUnnamedStringArg")
            .withArgs(["foo"])
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).not.toEmitEvent(WithUnnamedStringArg).withArgs(foo)

          Expected: "NOT WithUnnamedStringArg(foo)"
          Received: "WithUnnamedStringArg(foo)"]
        `);
      });
      test("multiple args", async () => {
        const { events } = await loadEventsFixture();

        await expect(
          expect(events.write.emitTwoUnnamedStrings(["foo", "bar"]))
            .not.toEmitEvent("WithTwoUnnamedStringArgs")
            .withArgs(["foo", "bar"])
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).not.toEmitEvent(WithTwoUnnamedStringArgs).withArgs(foo, bar)

          Expected: "NOT WithTwoUnnamedStringArgs(foo, bar)"
          Received: "WithTwoUnnamedStringArgs(foo, bar)"]
        `);
      });
      test("out of order args", async () => {
        const { events } = await loadEventsFixture();

        await expect(events.write.emitTwoUnnamedStrings(["foo", "bar"]))
          .not.toEmitEvent("WithTwoUnnamedStringArgs")
          .withArgs(["bar", "foo"]);
      });
    });
  });

  describe("reverted", () => {
    test("without reason", async () => {
      const { events } = await loadEventsFixture();

      await expect(
        expect(events.write.revertsWithoutReason()).toEmitEvent("WithUintArg")
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toEmitEvent(WithUintArg)

        Expected: "WithUintArg()"
        Received: "transaction reverted without a reason"]
      `);
    });

    test("with panic", async () => {
      const { events } = await loadEventsFixture();

      await expect(
        expect(events.write.panicAssert()).toEmitEvent("WithUintArg")
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toEmitEvent(WithUintArg)

        Expected: "WithUintArg()"
        Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
      `);
    });

    test("with error string", async () => {
      const { events } = await loadEventsFixture();

      await expect(
        expect(events.write.revertsWith(["foo"])).toEmitEvent("WithUintArg")
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toEmitEvent(WithUintArg)

        Expected: "WithUintArg()"
        Received: "transaction reverted with string: foo"]
      `);
    });

    test("with custom error", async () => {
      const { events } = await loadEventsFixture();

      await expect(
        expect(events.write.revertWithSomeCustomError()).toEmitEvent(
          "WithUintArg"
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toEmitEvent(WithUintArg)

        Expected: "WithUintArg()"
        Received: "transaction reverted with error: SomeCustomError()"]
      `);
    });

    test("with custom error and args", async () => {
      const { events } = await loadEventsFixture();

      await expect(
        expect(events.write.revertWithCustomErrorWithUint([1n])).toEmitEvent(
          "WithUintArg"
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toEmitEvent(WithUintArg)

        Expected: "WithUintArg()"
        Received: "transaction reverted with error: CustomErrorWithUint(1)"]
      `);
    });
  });
});
