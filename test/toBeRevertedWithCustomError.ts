import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { createColors } from "@vitest/utils";
import { expect } from "chai";
import { deployMatchers } from "./fixtures.js";
import { expectAssertionError } from "./helpers.js";

describe("toBeRevertedWithCustomError", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers)
          .write("succeeds")
          .toBeRevertedWithCustomError("SomeCustomError"),
        "Expected transaction to be reverted with custom error 'SomeCustomError', but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("matching custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("revertWithSomeCustomError")
          .toBeRevertedWithCustomError("SomeCustomError");
      });
      it("mismatching custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithSomeCustomError")
            .toBeRevertedWithCustomError("AnotherCustomError"),
          "Expected transaction to be reverted with custom error 'AnotherCustomError', but it reverted with custom error 'SomeCustomError'"
        );
      });
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertsWithoutReason")
            .toBeRevertedWithCustomError("SomeCustomError"),
          "Expected transaction to be reverted with custom error 'SomeCustomError', but it reverted without a reason"
        );
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .toBeRevertedWithCustomError("SomeCustomError"),
          "Expected transaction to be reverted with custom error 'SomeCustomError', but it reverted with unknown error"
        );
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("panicAssert")
            .toBeRevertedWithCustomError("SomeCustomError"),
          "Expected transaction to be reverted with custom error 'SomeCustomError', but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("succeeds")
          .not.toBeRevertedWithCustomError("SomeCustomError");
      });
      describe("reverted transaction", () => {
        it("matching custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertWithSomeCustomError")
              .not.toBeRevertedWithCustomError("SomeCustomError"),
            "Expected transaction NOT to be reverted with custom error 'SomeCustomError', but it was"
          );
        });
        it("mismatching custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithSomeCustomError")
            .not.toBeRevertedWithCustomError("AnotherCustomError");
        });
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertsWithoutReason")
            .not.toBeRevertedWithCustomError("SomeCustomError");
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .not.toBeRevertedWithCustomError("SomeCustomError");
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("panicAssert")
            .not.toBeRevertedWithCustomError("SomeCustomError");
        });
      });
    });
  });
  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers)
          .read("succeedsView")
          .toBeRevertedWithCustomError("SomeCustomError"),
        "Expected transaction to be reverted with custom error 'SomeCustomError', but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("matching custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("revertWithSomeCustomErrorView")
          .toBeRevertedWithCustomError("SomeCustomError");
      });
      it("mismatching custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .toBeRevertedWithCustomError("AnotherCustomError"),
          "Expected transaction to be reverted with custom error 'AnotherCustomError', but it reverted with custom error 'SomeCustomError'"
        );
      });
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertsWithoutReasonView")
            .toBeRevertedWithCustomError("SomeCustomError"),
          "Expected transaction to be reverted with custom error 'SomeCustomError', but it reverted without a reason"
        );
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .toBeRevertedWithCustomError("SomeCustomError"),
          "Expected transaction to be reverted with custom error 'SomeCustomError', but it reverted with unknown error"
        );
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("panicAssertView")
            .toBeRevertedWithCustomError("SomeCustomError"),
          "Expected transaction to be reverted with custom error 'SomeCustomError', but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("succeedsView")
          .not.toBeRevertedWithCustomError("SomeCustomError");
      });
      describe("reverted transaction", () => {
        it("matching custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertWithSomeCustomErrorView")
              .not.toBeRevertedWithCustomError("SomeCustomError"),
            "Expected transaction NOT to be reverted with custom error 'SomeCustomError', but it was"
          );
        });
        it("mismatching custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .not.toBeRevertedWithCustomError("AnotherCustomError");
        });
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertsWithoutReasonView")
            .not.toBeRevertedWithCustomError("SomeCustomError");
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .not.toBeRevertedWithCustomError("SomeCustomError");
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("panicAssertView")
            .not.toBeRevertedWithCustomError("SomeCustomError");
        });
      });
    });
  });

  describe("withArgs", () => {
    describe("write", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("succeeds")
            .toBeRevertedWithCustomError("CustomErrorWithUint")
            .withArgs(1n),
          "Expected transaction to be reverted with custom error 'CustomErrorWithUint', but it didn't revert"
        );
      });
      describe("reverted transaction", () => {
        it("matching custom error, single arg array", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithCustomErrorWithUint", [1n])
            .toBeRevertedWithCustomError("CustomErrorWithUint")
            .withArgs(1n);
        });
        it("matching custom error, multiple arg array", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithCustomErrorWithUintAndString", [1n, "two"])
            .toBeRevertedWithCustomError("CustomErrorWithUintAndString")
            .withArgs(1n, "two");
        });
        it("matching custom error, anyValue matcher", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithCustomErrorWithUint", [1n])
            .toBeRevertedWithCustomError("CustomErrorWithUint")
            .withArgs(expect.anyValue);
        });

        const colors = createColors(true);
        it("matching custom error, mismatching args", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertWithCustomErrorWithUint", [1n])
              .toBeRevertedWithCustomError("CustomErrorWithUint")
              .withArgs(2n),
            `${colors.red(
              "Expected transaction to be reverted with custom error 'CustomErrorWithUint' and matching arguments, but it was"
            )}
  ${colors.green("+ expected")} ${colors.red("- actual")}

  ${colors.red("- [1n]")}
  ${colors.green("+ [2n]")}`
          );
        });
        it("matching custom error, mismatching args with anyValue", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertWithCustomErrorWithUintAndString", [1n, "two"])
              .toBeRevertedWithCustomError("CustomErrorWithUintAndString")
              .withArgs(2n, expect.anyValue),
            `${colors.red(
              "Expected transaction to be reverted with custom error 'CustomErrorWithUintAndString' and matching arguments, but it was"
            )}
  ${colors.green("+ expected")} ${colors.red("- actual")}

  ${colors.red('- [1n, "two"]')}
  ${colors.green("+ [2n, anyValue]")}`
          );
        });
      });
    });
  });
});
