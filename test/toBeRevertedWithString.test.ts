import hre from "hardhat";
import { describe, expect, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadMatchersFixture = createFixture(
  networkConnection,
  createDeployMatchersFixture
);

describe("toBeRevertedWithString", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.write.succeeds()).toBeRevertedWithString("some reason")
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithString("some reason")

        Expected: "transaction reverted with string: some reason"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("matching string", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.write.revertsWith(["some reason"])
        ).toBeRevertedWithString("some reason");
      });

      it("mismatching string", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertsWith(["some reason"])
          ).toBeRevertedWithString("another reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("another reason")

          Expected: "transaction reverted with string: another reason"
          Received: "transaction reverted with string: some reason"]
        `);
      });

      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.revertsWithoutReason()).toBeRevertedWithString(
            "some reason"
          )
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted without a reason"]
        `);
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).toBeRevertedWithString("some reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.panicAssert()).toBeRevertedWithString(
            "some reason"
          )
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithSomeCustomError()
          ).toBeRevertedWithString("some reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted with error: SomeCustomError()"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.succeeds()).not.toBeRevertedWithString(
          "some reason"
        );
      });

      describe("reverted transaction", () => {
        it("matching string", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertsWith(["some reason"])
            ).not.toBeRevertedWithString("some reason")
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithString("some reason")

            Expected: "NOT transaction reverted with string: some reason"
            Received: "transaction reverted with string: some reason"]
          `);
        });

        it("mismatching string", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertsWith(["some reason"])
          ).not.toBeRevertedWithString("another reason");
        });

        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertsWithoutReason()
          ).not.toBeRevertedWithString("some reason");
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).not.toBeRevertedWithString("some reason");
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(matchers.write.panicAssert()).not.toBeRevertedWithString(
            "some reason"
          );
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithSomeCustomError()
          ).not.toBeRevertedWithString("some reason");
        });
      });
    });
  });

  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.read.succeedsView()).toBeRevertedWithString(
          "some reason"
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithString("some reason")

        Expected: "transaction reverted with string: some reason"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", async () => {
      it("matching string", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.revertsWithView(["some reason"])
        ).toBeRevertedWithString("some reason");
      });

      it("mismatching string", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertsWithView(["some reason"])
          ).toBeRevertedWithString("another reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("another reason")

          Expected: "transaction reverted with string: another reason"
          Received: "transaction reverted with string: some reason"]
        `);
      });

      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertsWithoutReasonView()
          ).toBeRevertedWithString("some reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted without a reason"]
        `);
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).toBeRevertedWithString("some reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.read.panicAssertView()).toBeRevertedWithString(
            "some reason"
          )
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });

      it("known custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).toBeRevertedWithString("some reason")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithString("some reason")

          Expected: "transaction reverted with string: some reason"
          Received: "transaction reverted with error: SomeCustomError()"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.read.succeedsView()).not.toBeRevertedWithString(
          "some reason"
        );
      });

      describe("reverted transaction", () => {
        it("matching string", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.read.revertsWithView(["some reason"])
            ).not.toBeRevertedWithString("some reason")
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithString("some reason")

            Expected: "NOT transaction reverted with string: some reason"
            Received: "transaction reverted with string: some reason"]
          `);
        });

        it("mismatching string", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertsWithView(["some reason"])
          ).not.toBeRevertedWithString("another reason");
        });

        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertsWithoutReasonView()
          ).not.toBeRevertedWithString("some reason");
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).not.toBeRevertedWithString("some reason");
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.panicAssertView()
          ).not.toBeRevertedWithString("some reason");
        });

        it("known custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).not.toBeRevertedWithString("some reason");
        });
      });
    });
  });

  describe("regexp", () => {
    it("matching string", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        matchers.write.revertsWith(["some reason"])
      ).toBeRevertedWithString(/some reason/);
    });

    it("mismatching string", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(
          matchers.write.revertsWith(["some reason"])
        ).toBeRevertedWithString(/another reason/)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithString(/another reason/)

        Expected: "transaction reverted with string: matching /another reason/"
        Received: "transaction reverted with string: some reason"]
      `);
    });
  });
});
