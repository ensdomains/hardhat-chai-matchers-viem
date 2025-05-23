import hre from "hardhat";
import { describe, expect, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadMatchersFixture = createFixture(
  networkConnection,
  createDeployMatchersFixture
);

describe("toBeRevertedWithPanic", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(expect(matchers.write.succeeds()).toBeRevertedWithPanic())
        .rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithPanic()

        Expected: "transaction reverted with some panic code"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("any panic code", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.panicAssert()).toBeRevertedWithPanic();
      });

      it("matching panic code", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.panicAssert()).toBeRevertedWithPanic(1n);
      });

      it("mismatching panic code", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.panicAssert()).toBeRevertedWithPanic(17n)
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic(17)

          Expected: "transaction reverted with panic code: 17 (Arithmetic operation resulted in underflow or overflow)"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });

      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.revertsWithoutReason()).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted without a reason"]
        `);
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("string error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertsWith(["some reason"])
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted with string: some reason"]
        `);
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithSomeCustomError()
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted with error: SomeCustomError()"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.succeeds()).not.toBeRevertedWithPanic();
      });

      describe("reverted transaction", () => {
        it("any panic code", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.write.panicAssert()).not.toBeRevertedWithPanic()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithPanic()

            Expected: "NOT transaction reverted with some panic code"
            Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
          `);
        });

        it("matching panic code", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.write.panicAssert()).not.toBeRevertedWithPanic(1n)
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithPanic(1)

            Expected: "NOT transaction reverted with panic code: 1 (An \`assert\` condition failed)"
            Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
          `);
        });

        it("mismatching panic code", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(matchers.write.panicAssert()).not.toBeRevertedWithPanic(
            17n
          );
        });

        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertsWithoutReason()
          ).not.toBeRevertedWithPanic();
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).not.toBeRevertedWithPanic();
        });

        it("string error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertsWith(["some reason"])
          ).not.toBeRevertedWithPanic();
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithSomeCustomError()
          ).not.toBeRevertedWithPanic();
        });
      });
    });
  });

  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(expect(matchers.read.succeedsView()).toBeRevertedWithPanic())
        .rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithPanic()

        Expected: "transaction reverted with some panic code"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("any panic code", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.panicAssertView()).toBeRevertedWithPanic();
      });

      it("matching panic code", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.panicAssertView()).toBeRevertedWithPanic(1n);
      });

      it("mismatching panic code", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.read.panicAssertView()).toBeRevertedWithPanic(17n)
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic(17)

          Expected: "transaction reverted with panic code: 17 (Arithmetic operation resulted in underflow or overflow)"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });

      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertsWithoutReasonView()
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted without a reason"]
        `);
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("string error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertsWithView(["some reason"])
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted with string: some reason"]
        `);
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).toBeRevertedWithPanic()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithPanic()

          Expected: "transaction reverted with some panic code"
          Received: "transaction reverted with error: SomeCustomError()"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.succeedsView()).not.toBeRevertedWithPanic();
      });

      describe("reverted transaction", () => {
        it("any panic code", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.read.panicAssertView()).not.toBeRevertedWithPanic()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithPanic()

            Expected: "NOT transaction reverted with some panic code"
            Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
          `);
        });

        it("matching panic code", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.read.panicAssertView()).not.toBeRevertedWithPanic(
              1n
            )
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithPanic(1)

            Expected: "NOT transaction reverted with panic code: 1 (An \`assert\` condition failed)"
            Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
          `);
        });

        it("mismatching panic code", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.panicAssertView()
          ).not.toBeRevertedWithPanic(17n);
        });

        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertsWithoutReasonView()
          ).not.toBeRevertedWithPanic();
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).not.toBeRevertedWithPanic();
        });

        it("string error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertsWithView(["some reason"])
          ).not.toBeRevertedWithPanic();
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).not.toBeRevertedWithPanic();
        });
      });
    });
  });
});
