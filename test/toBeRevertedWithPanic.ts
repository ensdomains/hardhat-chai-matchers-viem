import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployMatchers } from "./fixtures.js";
import { expectAssertionError } from "./helpers.js";

describe("toBeRevertedWithPanic", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers).write("succeeds").toBeRevertedWithPanic(),
        "Expected transaction to be reverted with some panic code, but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("any panic code", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).write("panicAssert").toBeRevertedWithPanic();
      });
      it("matching panic code", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).write("panicAssert").toBeRevertedWithPanic(1n);
      });
      it("mismatching panic code", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers).write("panicAssert").toBeRevertedWithPanic(17n),
          "Expected transaction to be reverted with panic code 17 (Arithmetic operation resulted in underflow or overflow), but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertsWithoutReason")
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted without a reason"
        );
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted with unknown error"
        );
      });
      it("string error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertsWith", ["some reason"])
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted with reason 'some reason'"
        );
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithSomeCustomError")
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted with custom error 'SomeCustomError'"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).write("succeeds").not.toBeRevertedWithPanic();
      });
      describe("reverted transaction", () => {
        it("any panic code", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers).write("panicAssert").not.toBeRevertedWithPanic(),
            "Expected transaction NOT to be reverted with some panic code, but it reverted with panic code 1 (An `assert` condition failed)"
          );
        });
        it("matching panic code", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers).write("panicAssert").not.toBeRevertedWithPanic(1n),
            "Expected transaction NOT to be reverted with panic code 1 (An `assert` condition failed), but it was"
          );
        });
        it("mismatching panic code", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("panicAssert")
            .not.toBeRevertedWithPanic(17n);
        });
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertsWithoutReason")
            .not.toBeRevertedWithPanic();
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .not.toBeRevertedWithPanic();
        });
        it("string error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertsWith", ["some reason"])
            .not.toBeRevertedWithPanic();
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithSomeCustomError")
            .not.toBeRevertedWithPanic();
        });
      });
    });
  });
  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers).read("succeedsView").toBeRevertedWithPanic(),
        "Expected transaction to be reverted with some panic code, but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("any panic code", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).read("panicAssertView").toBeRevertedWithPanic();
      });
      it("matching panic code", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("panicAssertView")
          .toBeRevertedWithPanic(1n);
      });
      it("mismatching panic code", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers).read("panicAssertView").toBeRevertedWithPanic(17n),
          "Expected transaction to be reverted with panic code 17 (Arithmetic operation resulted in underflow or overflow), but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertsWithoutReasonView")
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted without a reason"
        );
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted with unknown error"
        );
      });
      it("string error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertsWithView", ["some reason"])
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted with reason 'some reason'"
        );
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .toBeRevertedWithPanic(),
          "Expected transaction to be reverted with some panic code, but it reverted with custom error 'SomeCustomError'"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).read("succeedsView").not.toBeRevertedWithPanic();
      });
      describe("reverted transaction", () => {
        it("any panic code", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("panicAssertView")
              .not.toBeRevertedWithPanic(),
            "Expected transaction NOT to be reverted with some panic code, but it reverted with panic code 1 (An `assert` condition failed)"
          );
        });
        it("matching panic code", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("panicAssertView")
              .not.toBeRevertedWithPanic(1n),
            "Expected transaction NOT to be reverted with panic code 1 (An `assert` condition failed), but it was"
          );
        });
        it("mismatching panic code", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("panicAssertView")
            .not.toBeRevertedWithPanic(17n);
        });
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertsWithoutReasonView")
            .not.toBeRevertedWithPanic();
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .not.toBeRevertedWithPanic();
        });
        it("string error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertsWithView", ["some reason"])
            .not.toBeRevertedWithPanic();
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .not.toBeRevertedWithPanic();
        });
      });
    });
  });
});
