import "hardhat/types/network";

import type {
  ConstructorArgs,
  ContractAbis,
  DeployContractConfig,
  GetContractAtConfig,
  HardhatViemHelpers as HardhatViemHelpers_,
} from "@nomicfoundation/hardhat-viem/types";
import type { Address, ContractConstructorArgs } from "viem";
import type { AnyArtifact, ContractReturnType } from "../types.js";

interface DeployContract {
  <ContractName extends keyof ContractAbis>(
    contractName: ContractName,
    constructorArgs?: ConstructorArgs<ContractName>,
    deployContractConfig?: DeployContractConfig
  ): Promise<ContractReturnType<ContractAbis[ContractName]>>;
  <ContractArtifact extends AnyArtifact>(
    contractArtifact: ContractArtifact,
    constructorArgs?: ContractConstructorArgs<ContractArtifact["abi"]>,
    deployContractConfig?: DeployContractConfig
  ): Promise<ContractReturnType<ContractArtifact["abi"]>>;
}

declare module "hardhat/types/network" {
  type HardhatViemHelpers<
    ChainTypeT extends ChainType | string = DefaultChainType
  > = Omit<
    HardhatViemHelpers_<ChainTypeT>,
    "deployContract" | "getContractAt"
  > & {
    deployContract: DeployContract;
    getContractAt: <ContractName extends keyof ContractAbis>(
      contractName: ContractName,
      address: Address,
      getContractAtConfig?: GetContractAtConfig
    ) => Promise<ContractReturnType<ContractAbis[ContractName]>>;
  };
}
