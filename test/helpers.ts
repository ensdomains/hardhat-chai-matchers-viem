import { AssertionError, expect } from "chai";
import hre from "hardhat";
import type { Hash } from "viem";

export const expectAssertionError = async (
  x: Promise<any>,
  message: string
) => {
  await expect(x).rejects.toThrowError(new AssertionError(message));
};

export async function mineSuccessfulTransaction() {
  const networkConnection = await hre.network.connect();
  const testClient = await networkConnection.viem.getTestClient();
  await testClient.setAutomine(false);

  const [signer] = await networkConnection.viem.getWalletClients();
  const tx = await signer.sendTransaction({ to: signer.account.address });

  await mineBlocksUntilTxIsIncluded(tx);

  await testClient.setAutomine(true);

  return tx;
}

export async function loadFixture<T>(fixture: () => Promise<T>) {
  const networkConnection = await hre.network.connect();
  return networkConnection.networkHelpers.loadFixture(fixture);
}

async function mineBlocksUntilTxIsIncluded(txHash: Hash) {
  const networkConnection = await hre.network.connect();
  const publicClient = await networkConnection.viem.getPublicClient();
  const testClient = await networkConnection.viem.getTestClient();

  let i = 0;

  while (true) {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

    if (receipt !== null) {
      return;
    }

    await testClient.mine({ blocks: 1 });

    i++;
    if (i > 100) {
      throw new Error(`Transaction was not mined after mining ${i} blocks`);
    }
  }
}
