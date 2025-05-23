import hre from "hardhat";
import { describe, expect, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadMatchersFixture = createFixture(
  networkConnection,
  createDeployMatchersFixture
);

describe("toBeRevertedWithCustomError", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.write.succeeds()).toBeRevertedWithCustomError(
          "SomeCustomError"
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithCustomError(SomeCustomError)

        Expected: "SomeCustomError()"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("matching custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.write.revertWithSomeCustomError()
        ).toBeRevertedWithCustomError("SomeCustomError");
      });

      it("mismatching custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithSomeCustomError()
          ).toBeRevertedWithCustomError("AnotherCustomError")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(AnotherCustomError)

          Expected: "AnotherCustomError()"
          Received: "SomeCustomError"]
        `);
      });

      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertsWithoutReason()
          ).toBeRevertedWithCustomError("SomeCustomError")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(SomeCustomError)

          Expected: "SomeCustomError()"
          Received: "transaction reverted without a reason"]
        `);
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).toBeRevertedWithCustomError("SomeCustomError")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(SomeCustomError)

          Expected: "SomeCustomError()"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.panicAssert()).toBeRevertedWithCustomError(
            "SomeCustomError"
          )
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(SomeCustomError)

          Expected: "SomeCustomError()"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });
    });

    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(matchers.write.succeeds()).not.toBeRevertedWithCustomError(
          "SomeCustomError"
        );
      });

      describe("reverted transaction", () => {
        it("matching custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertWithSomeCustomError()
            ).not.toBeRevertedWithCustomError("SomeCustomError")
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithCustomError(SomeCustomError)

            Expected: "NOT SomeCustomError()"
            Received: "SomeCustomError()"]
          `);
        });

        it("mismatching custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithSomeCustomError()
          ).not.toBeRevertedWithCustomError("AnotherCustomError");
        });

        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertsWithoutReason()
          ).not.toBeRevertedWithCustomError("SomeCustomError");
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithAnotherContractCustomError()
          ).not.toBeRevertedWithCustomError("SomeCustomError");
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.panicAssert()
          ).not.toBeRevertedWithCustomError("SomeCustomError");
        });
      });
    });
  });

  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadMatchersFixture();
      await expect(
        expect(matchers.read.succeedsView()).toBeRevertedWithCustomError(
          "SomeCustomError"
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
        [AssertionError: 
        expect(received).toBeRevertedWithCustomError(SomeCustomError)

        Expected: "SomeCustomError()"
        Received: "no revert"]
      `);
    });

    describe("reverted transaction", () => {
      it("matching custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.revertWithSomeCustomErrorView()
        ).toBeRevertedWithCustomError("SomeCustomError");
      });

      it("mismatching custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).toBeRevertedWithCustomError("AnotherCustomError")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(AnotherCustomError)

          Expected: "AnotherCustomError()"
          Received: "SomeCustomError"]
        `);
      });

      it("empty", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertsWithoutReasonView()
          ).toBeRevertedWithCustomError("SomeCustomError")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(SomeCustomError)

          Expected: "SomeCustomError()"
          Received: "transaction reverted without a reason"]
        `);
      });

      it("unknown custom error", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).toBeRevertedWithCustomError("SomeCustomError")
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(SomeCustomError)

          Expected: "SomeCustomError()"
          Received: "transaction reverted with unknown error"]
        `);
      });

      it("panic", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.read.panicAssertView()).toBeRevertedWithCustomError(
            "SomeCustomError"
          )
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(SomeCustomError)

          Expected: "SomeCustomError()"
          Received: "transaction reverted with panic code: 1 (An \`assert\` condition failed)"]
        `);
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          matchers.read.succeedsView()
        ).not.toBeRevertedWithCustomError("SomeCustomError");
      });

      describe("reverted transaction", () => {
        it("matching custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.read.revertWithSomeCustomErrorView()
            ).not.toBeRevertedWithCustomError("SomeCustomError")
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).not.toBeRevertedWithCustomError(SomeCustomError)

            Expected: "NOT SomeCustomError()"
            Received: "SomeCustomError()"]
          `);
        });

        it("mismatching custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithSomeCustomErrorView()
          ).not.toBeRevertedWithCustomError("AnotherCustomError");
        });

        it("empty", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertsWithoutReasonView()
          ).not.toBeRevertedWithCustomError("SomeCustomError");
        });

        it("unknown custom error", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.revertWithAnotherContractCustomErrorView()
          ).not.toBeRevertedWithCustomError("SomeCustomError");
        });

        it("panic", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.read.panicAssertView()
          ).not.toBeRevertedWithCustomError("SomeCustomError");
        });
      });
    });
  });

  describe("withArgs", () => {
    describe("write", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadMatchersFixture();
        await expect(
          expect(matchers.write.succeeds())
            .toBeRevertedWithCustomError("CustomErrorWithUint")
            .withArgs([1n])
        ).rejects.toThrowErrorMatchingInlineSnapshot(`
          [AssertionError: 
          expect(received).toBeRevertedWithCustomError(CustomErrorWithUint).withArgs(1)

          Expected: "CustomErrorWithUint(1)"
          Received: "no revert"]
        `);
      });

      describe("reverted transaction", () => {
        it("matching custom error, single arg array", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(matchers.write.revertWithCustomErrorWithUint([1n]))
            .toBeRevertedWithCustomError("CustomErrorWithUint")
            .withArgs([1n]);
        });

        it("matching custom error, multiple arg array", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            matchers.write.revertWithCustomErrorWithUintAndString([1n, "two"])
          )
            .toBeRevertedWithCustomError("CustomErrorWithUintAndString")
            .withArgs([1n, "two"]);
        });

        it("matching custom error, anyValue matcher", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(matchers.write.revertWithCustomErrorWithUint([1n]))
            .toBeRevertedWithCustomError("CustomErrorWithUint")
            .withArgs([expect.anything()]);
        });

        it("matching custom error, inner array", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(matchers.write.revertWithCustomErrorWithPair([1n, 1n]))
            .toBeRevertedWithCustomError("CustomErrorWithPair")
            .withArgs([{ a: 1n, b: 1n }]);
        });

        it("matching custom error, mismatching args", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(matchers.write.revertWithCustomErrorWithUint([1n]))
              .toBeRevertedWithCustomError("CustomErrorWithUint")
              .withArgs([2n])
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).toBeRevertedWithCustomError(CustomErrorWithUint).withArgs(2)

            Expected: "CustomErrorWithUint(2)"
            Received: "CustomErrorWithUint(1)"]
          `);
        });

        it("matching custom error, mismatching args with anyValue", async () => {
          const { matchers } = await loadMatchersFixture();
          await expect(
            expect(
              matchers.write.revertWithCustomErrorWithUintAndString([1n, "two"])
            )
              .toBeRevertedWithCustomError("CustomErrorWithUintAndString")
              .withArgs([2n, expect.anything()])
          ).rejects.toThrowErrorMatchingInlineSnapshot(`
            [AssertionError: 
            expect(received).toBeRevertedWithCustomError(CustomErrorWithUintAndString).withArgs(2, Anything)

            Expected: "CustomErrorWithUintAndString(2, Anything)"
            Received: "CustomErrorWithUintAndString(1, two)"]
          `);
        });
      });
    });
  });
});
