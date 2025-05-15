// Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/test/token/ERC1155/ERC1155.behaviour.js
// Copyright (c) 2016-2020 zOS Global Limited

import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import { expect } from "chai";
import hre from "hardhat";
import type { ArtifactMap } from "hardhat/types/artifacts";
import type {
  ChainType,
  DefaultChainType,
  NetworkConnection,
} from "hardhat/types/network";
import {
  encodeFunctionData,
  getAbiItem,
  toFunctionSelector,
  toFunctionSignature,
  type Abi,
  type Address,
} from "viem";
import { beforeAll, describe, it } from "vitest";

import {
  createInterfaceId,
  getSolidityReferenceInterfaceAbi,
} from "../utils/createInterfaceId.js";

type SupportsInterfaceAbi = {
  inputs: [
    {
      internalType: "bytes4";
      name: "interfaceId";
      type: "bytes4";
    }
  ];
  name: "supportsInterface";
  outputs: [
    {
      internalType: "bool";
      name: "";
      type: "bool";
    }
  ];
  stateMutability: "view";
  type: "function";
};

type SupportsInterfaceContract = GetContractReturnType<[SupportsInterfaceAbi]>;

export const shouldSupportInterfaces = <
  TContract extends {
    abi: Abi;
    address: Address;
    read: {
      supportsInterface: SupportsInterfaceContract["read"]["supportsInterface"];
    };
  }
>({
  contract,
  interfaces,
}: {
  contract: <TChainType extends ChainType | string = DefaultChainType>(
    networkConnection: NetworkConnection<TChainType>
  ) => TContract | Promise<TContract>;
  interfaces: (keyof ArtifactMap)[];
}) => {
  let deployedContract: TContract;

  beforeAll(async () => {
    const networkConnection = await hre.network.connect();
    deployedContract = await contract(networkConnection);
  });

  describe("Contract interface", function () {
    for (const interfaceName of interfaces) {
      describe(interfaceName, async () => {
        const interfaceAbi = await getSolidityReferenceInterfaceAbi(
          interfaceName
        );
        const interfaceId = createInterfaceId(interfaceAbi as Abi);

        for (const fn of interfaceAbi) {
          const sig = toFunctionSignature(fn);
          const selector = toFunctionSelector(fn);
          it(`implements ${sig}`, () => {
            expect(
              getAbiItem({ abi: deployedContract.abi, name: selector })
            ).not.toBeUndefined();
          });
        }

        describe("ERC165's supportsInterface(bytes4)", () => {
          it("uses less than 30k gas [skip-on-coverage]", async () => {
            const networkConnection = await hre.network.connect();
            const publicClient = await networkConnection.viem.getPublicClient();

            await expect(
              publicClient.estimateGas({
                to: deployedContract.address,
                data: encodeFunctionData({
                  abi: deployedContract.abi,
                  functionName: "supportsInterface",
                  args: [interfaceId],
                }),
              })
            ).resolves.toBeLessThan(30000n);
          });

          it("claims support", async () => {
            await expect(
              deployedContract.read.supportsInterface([interfaceId])
            ).resolves.toBe(true);
          });
        });
      });
    }
  });
};
