import hre from "hardhat";
import { describe, expect, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadMatchersFixture = createFixture(
  networkConnection,
  createDeployMatchersFixture
);

describe("toBeReverted", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(expect(matchers.write.succeeds()).toBeReverted()).rejects
        .toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeReverted()

        Expected: "revert"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.revertsWithoutReason()).toBeReverted();
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.write.revertWithAnotherContractCustomError()
        ).toBeReverted();
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.panicAssert()).toBeReverted();
      });

      it("string error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.write.revertsWith(["some reason"])
        ).toBeReverted();
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.revertWithSomeCustomError()).toBeReverted();
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.succeeds()).not.toBeReverted();
      });

      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.write.revertsWithoutReason()).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted without a reason"]
          `);
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertWithAnotherContractCustomError()
            ).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with unknown error"]
          `);
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(expect(matchers.write.panicAssert()).not.toBeReverted())
            .rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
          `);
        });

        it("string error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertsWith(["some reason"])
            ).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with string: some reason"]
          `);
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertWithSomeCustomError()
            ).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with error: SomeCustomError()"]
          `);
        });
      });
    });
  });
  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.read.succeedsView()).toBeReverted()
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [AssertionError: 
        expect(received).toBeReverted()

        Expected: "revert"
        Received: "no revert"]
      `
      );
    });

    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.revertsWithoutReasonView()).toBeReverted();
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.revertWithAnotherContractCustomErrorView()
        ).toBeReverted();
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.panicAssertView()).toBeReverted();
      });

      it("string error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.revertsWithView(["some reason"])
        ).toBeReverted();
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.revertWithSomeCustomErrorView()
        ).toBeReverted();
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.succeedsView()).not.toBeReverted();
      });

      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.read.revertsWithoutReasonView()).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted without a reason"]
          `);
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.read.revertWithAnotherContractCustomErrorView()
            ).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with unknown error"]
          `);
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.read.panicAssertView()).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
          `);
        });

        it("string error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.read.revertsWithView(["some reason"])
            ).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with string: some reason"]
          `);
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.read.revertWithSomeCustomErrorView()
            ).not.toBeReverted()
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeReverted()

            Expected: "no revert"
            Received: "transaction reverted with error: SomeCustomError()"]
          `);
        });
      });
    });
  });
});
