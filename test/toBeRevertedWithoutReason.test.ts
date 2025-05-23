import hre from "hardhat";
import { describe, expect, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadMatchersFixture = createFixture(
  networkConnection,
  createDeployMatchersFixture
);

describe("toBeRevertedWithoutReason", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.write.succeeds()).toBeRevertedWithoutReason()
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithoutReason()

        Expected: "transaction reverted without a reason"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.write.revertsWithoutReason()
        ).toBeRevertedWithoutReason();
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.panicAssert()).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });

      it("string error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertsWith(["some reason"])
          ).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with string: some reason"]
        `);
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithSomeCustomError()
          ).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with error: SomeCustomError()"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.succeeds()).not.toBeRevertedWithoutReason();
      });

      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertsWithoutReason()
            ).not.toBeRevertedWithoutReason()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithoutReason()

            Expected: "not transaction reverted without a reason"
            Received: "transaction reverted without a reason"]
          `);
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).not.toBeRevertedWithoutReason();
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.panicAssert()
          ).not.toBeRevertedWithoutReason();
        });

        it("string error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertsWith(["some reason"])
          ).not.toBeRevertedWithoutReason();
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithSomeCustomError()
          ).not.toBeRevertedWithoutReason();
        });
      });
    });
  });

  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.read.succeedsView()).toBeRevertedWithoutReason()
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithoutReason()

        Expected: "transaction reverted without a reason"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.revertsWithoutReasonView()
        ).toBeRevertedWithoutReason();
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.read.panicAssertView()).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });

      it("string error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertsWithView(["some reason"])
          ).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with string: some reason"]
        `);
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).toBeRevertedWithoutReason()
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithoutReason()

          Expected: "transaction reverted without a reason"
          Received: "transaction reverted with error: SomeCustomError()"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.succeedsView()
        ).not.toBeRevertedWithoutReason();
      });

      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.read.revertsWithoutReasonView()
            ).not.toBeRevertedWithoutReason()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithoutReason()

            Expected: "not transaction reverted without a reason"
            Received: "transaction reverted without a reason"]
          `);
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).not.toBeRevertedWithoutReason();
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.panicAssertView()
          ).not.toBeRevertedWithoutReason();
        });

        it("string error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertsWithView(["some reason"])
          ).not.toBeRevertedWithoutReason();
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).not.toBeRevertedWithoutReason();
        });
      });
    });
  });
});
