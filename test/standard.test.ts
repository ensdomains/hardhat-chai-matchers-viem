import hre from "hardhat";
import { describe, expect, it } from "vitest";

import type { PublicClient } from "@nomicfoundation/hardhat-viem/types";
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

  it("should allow funcs to be used with a custom client", async () => {
    let doError = false;
    const realPublicClient = await networkConnection.viem.getPublicClient();
    const publicClient = new Proxy(
      {},
      {
        get(_, prop) {
          if (doError)
            return async () => {
              throw new Error("test");
            };
          return realPublicClient[prop as keyof typeof realPublicClient];
        },
      }
    ) as unknown as PublicClient;
    const contract = await networkConnection.viem.deployContract(
      "Matchers",
      [],
      {
        client: {
          public: publicClient,
        },
      }
    );
    doError = true;
    await expect(contract.read.succeedsView()).rejects.toThrowError("test");
  });

  it("should allow toBeRevertedWithCustomErrorFrom to be used with a contract", async () => {
    const { matchers } = await loadMatchersFixture();
    const anotherContract = await networkConnection.viem.getContractAt(
      "AnotherMatchersContract",
      await matchers.read.anotherContract()
    );
    await expect(
      matchers.write.revertWithAnotherContractCustomError()
    ).toBeRevertedWithCustomErrorFrom(anotherContract, "YetAnotherCustomError");
  });

  it("should allow arbitrary to be used with a contract", async () => {
    const { matchers } = await loadMatchersFixture();
    const [walletClient] = await networkConnection.viem.getWalletClients();
    await expect(
      matchers.arbitrary({
        to: matchers.address,
        data: "0x",
        account: walletClient.account,
      })
    ).toBeRevertedWithoutReason();
  });
});
