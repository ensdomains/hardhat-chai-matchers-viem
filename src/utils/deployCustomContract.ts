import { HardhatError } from "@nomicfoundation/hardhat-errors";
import type {
  DeployContractConfig,
  GetContractReturnType,
} from "@nomicfoundation/hardhat-viem/types";
import type { Artifact } from "hardhat/types/artifacts";
import type {
  DefaultChainType,
  NetworkConnection,
} from "hardhat/types/network";
import { getContract, type Hex } from "viem";

// modified from https://github.com/NomicFoundation/hardhat/blob/82f250e2bf07491b0fff48062bc1a74f0667a50d/v-next/hardhat-viem/src/internal/contracts.ts
export async function deployCustomContract<ContractArtifact extends Artifact>(
  networkConnection: NetworkConnection<DefaultChainType>,
  contractArtifact: ContractArtifact,
  constructorArgs: unknown[] = [],
  deployContractConfig: DeployContractConfig = {}
): Promise<GetContractReturnType<ContractArtifact["abi"]>> {
  const {
    client,
    confirmations = 1,
    libraries = {},
    ...deployContractParameters
  } = deployContractConfig;

  if (confirmations < 0) {
    throw new HardhatError(
      HardhatError.ERRORS.HARDHAT_VIEM.GENERAL.INVALID_CONFIRMATIONS,
      {
        error: "Confirmations must be greather than 0.",
      }
    );
  }
  if (confirmations === 0) {
    throw new HardhatError(
      HardhatError.ERRORS.HARDHAT_VIEM.GENERAL.INVALID_CONFIRMATIONS,
      {
        error:
          "deployContract does not support 0 confirmations. Use sendDeploymentTransaction if you want to handle the deployment transaction yourself.",
      }
    );
  }

  const [publicClient, walletClient] = await Promise.all([
    client?.public ?? networkConnection.viem.getPublicClient(),
    client?.wallet ??
      networkConnection.viem.getWalletClients().then((clients) => clients[0]),
  ]);

  let deploymentTxHash: Hex;
  // If gasPrice is defined, then maxFeePerGas and maxPriorityFeePerGas
  // must be undefined because it's a legaxy tx.
  if (deployContractParameters.gasPrice !== undefined) {
    deploymentTxHash = await walletClient.deployContract({
      abi: contractArtifact.abi,
      bytecode: contractArtifact.bytecode as Hex,
      args: constructorArgs,
      ...deployContractParameters,
      maxFeePerGas: undefined,
      maxPriorityFeePerGas: undefined,
    });
  } else {
    deploymentTxHash = await walletClient.deployContract({
      abi: contractArtifact.abi,
      bytecode: contractArtifact.bytecode as Hex,
      args: constructorArgs,
      ...deployContractParameters,
      gasPrice: undefined,
    });
  }

  const { contractAddress } = await publicClient.waitForTransactionReceipt({
    hash: deploymentTxHash,
    confirmations,
  });

  if (contractAddress === null || contractAddress === undefined) {
    const transaction = await publicClient.getTransaction({
      hash: deploymentTxHash,
    });
    throw new HardhatError(
      HardhatError.ERRORS.HARDHAT_VIEM.GENERAL.DEPLOY_CONTRACT_ERROR,
      {
        txHash: deploymentTxHash,
        blockNumber: transaction.blockNumber,
      }
    );
  }

  return getContract({
    address: contractAddress,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
    abi: contractArtifact.abi,
  }) as unknown as GetContractReturnType<ContractArtifact["abi"]>;
}
