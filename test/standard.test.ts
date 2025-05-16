import { expect } from "chai";
import hre from "hardhat";
import { describe, it } from "vitest";

import { createDeployMatchersFixture } from "./fixtures.js";
import { matchersArtifact } from "./fixtures/matchersArtifact.js";
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

  it("should allow deployContract to be used with an artifact", async () => {
    const matchers = await networkConnection.viem.deployContract(
      matchersArtifact,
      []
    );
    await expect(matchers.read.succeedsView()).resolves.toBe(0n);
    await expect(matchers.write.revertsWithoutReason()).toBeReverted();
  });
});
