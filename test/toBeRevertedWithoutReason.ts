import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployMatchers } from "./fixtures.js";
import { expectAssertionError } from "./helpers.js";

describe("toBeRevertedWithoutReason", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers).write("succeeds").toBeRevertedWithoutReason(),
        "Expected transaction to be reverted without a reason, but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("revertsWithoutReason")
          .toBeRevertedWithoutReason();
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with unknown error"
        );
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers).write("panicAssert").toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
      it("string error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertsWith", ["some reason"])
            .toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with error 'some reason'"
        );
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithSomeCustomError")
            .toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with custom error 'SomeCustomError'"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("succeeds")
          .not.toBeRevertedWithoutReason();
      });
      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertsWithoutReason")
              .not.toBeRevertedWithoutReason(),
            "Expected transaction NOT to be reverted without a reason, but it was"
          );
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .not.toBeRevertedWithoutReason();
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("panicAssert")
            .not.toBeRevertedWithoutReason();
        });
        it("string error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertsWith", ["some reason"])
            .not.toBeRevertedWithoutReason();
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithSomeCustomError")
            .not.toBeRevertedWithoutReason();
        });
      });
    });
  });
  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers).read("succeedsView").toBeRevertedWithoutReason(),
        "Expected transaction to be reverted without a reason, but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("revertsWithoutReasonView")
          .toBeRevertedWithoutReason();
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with unknown error"
        );
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers).read("panicAssertView").toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
      it("string error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertsWithView", ["some reason"])
            .toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with error 'some reason'"
        );
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .toBeRevertedWithoutReason(),
          "Expected transaction to be reverted without a reason, but it reverted with custom error 'SomeCustomError'"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("succeedsView")
          .not.toBeRevertedWithoutReason();
      });
      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertsWithoutReasonView")
              .not.toBeRevertedWithoutReason(),
            "Expected transaction NOT to be reverted without a reason, but it was"
          );
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .not.toBeRevertedWithoutReason();
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("panicAssertView")
            .not.toBeRevertedWithoutReason();
        });
        it("string error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertsWithView", ["some reason"])
            .not.toBeRevertedWithoutReason();
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .not.toBeRevertedWithoutReason();
        });
      });
    });
  });
});
