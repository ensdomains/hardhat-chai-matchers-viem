import hre from "hardhat";
import type { Hash } from "viem";

export async function getTransactionReceipt(hash: Hash) {
  const publicClient = await hre.viem.getPublicClient();

  return publicClient.getTransactionReceipt({ hash });
}
