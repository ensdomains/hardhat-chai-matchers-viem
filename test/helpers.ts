import type { Fixture } from "@nomicfoundation/hardhat-network-helpers/types";
import { AssertionError, expect } from "chai";
import hre from "hardhat";
import type {
  DefaultChainType,
  NetworkConnection,
} from "hardhat/types/network";
import type { Hash } from "viem";

export const expectAssertionError = async (
  x: Promise<any>,
  message: string
) => {
  await expect(x).rejects.toThrowError(new AssertionError(message));
};

export function createFixture<T>(
  networkConnection: NetworkConnection<DefaultChainType>,
  fixture: (n: NetworkConnection<DefaultChainType>) => Fixture<T>
) {
  const initialisedFixture = fixture(networkConnection);
  return async () =>
    networkConnection.networkHelpers.loadFixture(initialisedFixture);
}

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
