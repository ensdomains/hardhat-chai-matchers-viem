import hre from "hardhat";
import type { Hash, TransactionReceipt } from "viem";

export async function getTransactionReceipt(
  hash: Hash
): Promise<TransactionReceipt> {
  const networkConnection = await hre.network.connect();
  const publicClient = await networkConnection.viem.getPublicClient();

  return publicClient.getTransactionReceipt({ hash });
}
