import { expect } from "chai";
import { describe, it } from "vitest";
import { deployMatchers } from "./fixtures.js";

describe("standard", () => {
  it("should allow asserting against resolved data", async () => {
    const { matchers } = await deployMatchers();
    await expect(matchers.read.succeedsView()).resolves.toBe(0n);
  });

  it("should allow usage with getContractAt", async () => {
    const { matchers, networkConnection } = await deployMatchers();
    const contract = await networkConnection.viem.getContractAt(
      "Matchers",
      matchers.address
    );
    await expect(contract.write.revertsWithoutReason()).toBeReverted();
  });
});
