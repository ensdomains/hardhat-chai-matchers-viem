import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { HardhatChaiMatchersNonChainableMatcherError } from "../src/errors.js";
import "../src/index.js";
import { TO_BE_REVERTED_MATCHER } from "../src/matchers/constants.js";
import { WriteCallAssertion } from "../src/types.js";
import { deployMatchers } from "./fixtures.js";
import { expectAssertionError } from "./helpers.js";

describe("toBeReverted", () => {
  describe("write", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers).write("succeeds").toBeReverted(),
        "Expected transaction to be reverted"
      );
    });
    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).write("revertsWithoutReason").toBeReverted();
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("revertWithAnotherContractCustomError")
          .toBeReverted();
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).write("panicAssert").toBeReverted();
      });
      it("string error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("revertsWith", ["some reason"])
          .toBeReverted();
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .write("revertWithSomeCustomError")
          .toBeReverted();
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).write("succeeds").not.toBeReverted();
      });
      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers).write("revertsWithoutReason").not.toBeReverted(),
            "Expected transaction NOT to be reverted"
          );
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertWithAnotherContractCustomError")
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with unknown error"
          );
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers).write("panicAssert").not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with panic code 1 (An `assert` condition failed)"
          );
        });
        it("string error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertsWith", ["some reason"])
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with reason 'some reason'"
          );
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .write("revertWithSomeCustomError")
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with custom error 'SomeCustomError'"
          );
        });
      });
    });
  });
  describe("read", () => {
    it("successful transaction", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      await expectAssertionError(
        expect(matchers).read("succeedsView").toBeReverted(),
        "Expected transaction to be reverted"
      );
    });
    describe("reverted transaction", () => {
      it("empty", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).read("revertsWithoutReasonView").toBeReverted();
      });
      it("unknown custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("revertWithAnotherContractCustomErrorView")
          .toBeReverted();
      });
      it("panic", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).read("panicAssertView").toBeReverted();
      });
      it("string error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("revertsWithView", ["some reason"])
          .toBeReverted();
      });
      it("known custom error", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers)
          .read("revertWithSomeCustomErrorView")
          .toBeReverted();
      });
    });
    describe("negated", () => {
      it("successful transaction", async () => {
        const { matchers } = await loadFixture(deployMatchers);
        await expect(matchers).read("succeedsView").not.toBeReverted();
      });
      describe("reverted transaction", () => {
        it("empty", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertsWithoutReasonView")
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted"
          );
        });
        it("unknown custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertWithAnotherContractCustomErrorView")
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with unknown error"
          );
        });
        it("panic", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers).read("panicAssertView").not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with panic code 1 (An `assert` condition failed)"
          );
        });
        it("string error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertsWithView", ["some reason"])
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with reason 'some reason'"
          );
        });
        it("known custom error", async () => {
          const { matchers } = await loadFixture(deployMatchers);
          await expectAssertionError(
            expect(matchers)
              .read("revertWithSomeCustomErrorView")
              .not.toBeReverted(),
            "Expected transaction NOT to be reverted, but it reverted with custom error 'SomeCustomError'"
          );
        });
      });
    });
  });
  describe("promise", () => {
    it("empty", async () => {
      const { matchers } = await loadFixture(deployMatchers);
      const promise = matchers.write.revertsWithoutReason();

      await expect(matchers).transaction(promise).toBeReverted();
    });
  });
  it("hash", async () => {
    const { matchers } = await loadFixture(deployMatchers);
    const hash = await matchers.write.succeeds();
    await expect(
      (
        expect(matchers).transaction(hash).not as unknown as WriteCallAssertion<
          typeof matchers
        >
      ).toBeReverted()
    ).rejects.toThrowError(
      new HardhatChaiMatchersNonChainableMatcherError(
        TO_BE_REVERTED_MATCHER,
        "transaction(hash)"
      )
    );
  });
});
