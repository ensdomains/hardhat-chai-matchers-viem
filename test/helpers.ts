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
  await hre.network.provider.send("evm_setAutomine", [false]);

  const [signer] = await hre.viem.getWalletClients();
  const tx = await signer.sendTransaction({ to: signer.account.address });

  await mineBlocksUntilTxIsIncluded(tx);

  await hre.network.provider.send("evm_setAutomine", [true]);

  return tx;
}

async function mineBlocksUntilTxIsIncluded(txHash: Hash) {
  const publicClient = await hre.viem.getPublicClient();

  let i = 0;

  while (true) {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

    if (receipt !== null) {
      return;
    }

    await hre.network.provider.send("hardhat_mine", []);

    i++;
    if (i > 100) {
      throw new Error(`Transaction was not mined after mining ${i} blocks`);
    }
  }
}
