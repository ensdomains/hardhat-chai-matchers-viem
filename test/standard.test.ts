import { expect } from "chai";
import hre from "hardhat";
import { describe, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadMatchersFixture = createFixture(
  networkConnection,
  createDeployMatchersFixture
);

describe("standard", () => {
  it("should allow asserting against resolved data", async () => {
    const { matchers } = await loadMatchersFixture();
    await expect(matchers.read.succeedsView()).resolves.toBe(0n);
  });

  it("should allow usage with getContractAt", async () => {
    const { matchers } = await loadMatchersFixture();
    const contract = await networkConnection.viem.getContractAt(
      "Matchers",
      matchers.address
    );
    await expect(contract.write.revertsWithoutReason()).toBeReverted();
  });
});
