import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployMatchers } from "./fixtures.js";
import { expectAssertionError } from "./helpers.js";

describe("toBeRevertedWithString", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers)
          .write("succeeds")
          .toBeRevertedWithString("some reason"),
        "Expected transaction to be reverted with reason 'some reason', but it didn't revert"
      );
    });
    describe("reverted transaction", () => {
      it("matching string", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("revertsWith", ["some reason"])
          .toBeRevertedWithString("some reason");
      });
      it("mismatching string", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertsWith", ["some reason"])
            .toBeRevertedWithString("another reason"),
          "Expected transaction to be reverted with reason 'another reason', but it reverted with reason 'some reason'"
        );
      });
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertsWithoutReason")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted without a reason"
        );
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted with unknown error"
        );
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("panicAssert")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .write("revertWithSomeCustomError")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted with custom error 'SomeCustomError'"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("succeeds")
          .not.toBeRevertedWithString("some reason");
      });
      describe("reverted transaction", () => {
        it("matching string", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertsWith", ["some reason"])
              .not.toBeRevertedWithString("some reason"),
            "Expected transaction NOT to be reverted with reason 'some reason', but it was"
          );
        });
        it("mismatching string", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertsWith", ["some reason"])
            .not.toBeRevertedWithString("another reason");
        });
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertsWithoutReason")
            .not.toBeRevertedWithString("some reason");
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithAnotherContractCustomError")
            .not.toBeRevertedWithString("some reason");
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("panicAssert")
            .not.toBeRevertedWithString("some reason");
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .write("revertWithSomeCustomError")
            .not.toBeRevertedWithString("some reason");
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
          .toBeRevertedWithString("some reason"),
        "Expected transaction to be reverted with reason 'some reason', but it didn't revert"
      );
    });
    describe("reverted transaction", async () => {
      it("matching string", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("revertsWithView", ["some reason"])
          .toBeRevertedWithString("some reason");
      });
      it("mismatching string", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertsWithView", ["some reason"])
            .toBeRevertedWithString("another reason"),
          "Expected transaction to be reverted with reason 'another reason', but it reverted with reason 'some reason'"
        );
      });
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertsWithoutReasonView")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted without a reason"
        );
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted with unknown error"
        );
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("panicAssertView")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted with panic code 1 (An `assert` condition failed)"
        );
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expectAssertionError(
          expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .toBeRevertedWithString("some reason"),
          "Expected transaction to be reverted with reason 'some reason', but it reverted with custom error 'SomeCustomError'"
        );
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("succeedsView")
          .not.toBeRevertedWithString("some reason");
      });
      describe("reverted transaction", () => {
        it("matching string", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertsWithView", ["some reason"])
              .not.toBeRevertedWithString("some reason"),
            "Expected transaction NOT to be reverted with reason 'some reason', but it was"
          );
        });
        it("mismatching string", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertsWithView", ["some reason"])
            .not.toBeRevertedWithString("another reason");
        });
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertsWithoutReasonView")
            .not.toBeRevertedWithString("some reason");
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithAnotherContractCustomErrorView")
            .not.toBeRevertedWithString("some reason");
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("panicAssertView")
            .not.toBeRevertedWithString("some reason");
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expect(matchers)
            .read("revertWithSomeCustomErrorView")
            .not.toBeRevertedWithString("some reason");
        });
      });
    });
  });
});
