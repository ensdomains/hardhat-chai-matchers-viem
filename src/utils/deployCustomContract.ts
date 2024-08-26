import {
  getContract,
  type Abi,
  type Account,
  type Chain,
  type Client,
  type DeployContractParameters,
  type GetContractReturnType,
  type PublicClient,
  type Transport,
  type WalletClient,
} from "viem";
import { deployContract, getTransactionReceipt } from "viem/actions";

type ExplicitKeyedContract = {
  public: PublicClient;
  wallet: WalletClient;
};

export async function deployCustomContract<
  const abi extends Abi | readonly unknown[],
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined
>(
  walletClient: Client<Transport, chain, account>,
  parameters: DeployContractParameters<abi, chain, account, chainOverride>
): Promise<GetContractReturnType<abi, ExplicitKeyedContract>> {
  const deploymentHash = await deployContract(walletClient, parameters);
  const receipt = await getTransactionReceipt(walletClient, {
    hash: deploymentHash,
  });
  if (!receipt.contractAddress) throw new Error("Contract deployment failed");
  const contract = getContract({
    abi: parameters.abi,
    address: receipt.contractAddress,
    client: walletClient,
  });
  return contract as GetContractReturnType<abi, ExplicitKeyedContract>;
}
