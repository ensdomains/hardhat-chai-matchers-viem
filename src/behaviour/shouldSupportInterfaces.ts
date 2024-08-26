// Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/test/token/ERC1155/ERC1155.behaviour.js
// Copyright (c) 2016-2020 zOS Global Limited

import { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types.js";
import { expect } from "chai";
import hre from "hardhat";
import type { ArtifactsMap } from "hardhat/types/artifacts.js";
import {
  encodeFunctionData,
  getAbiItem,
  toFunctionSelector,
  toFunctionSignature,
  type Abi,
  type AbiFunction,
  type Address,
  type Hex,
} from "viem";
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
  contract: () => TContract | Promise<TContract>;
  interfaces: (keyof ArtifactsMap)[];
}) => {
  let deployedContract: TContract;

  before(async () => {
    deployedContract = await contract();
  });

  describe("Contract interface", function () {
    for (const interfaceName of interfaces) {
      describe(interfaceName, function () {
        let interfaceAbi: AbiFunction[];
        let interfaceId: Hex;

        before(async () => {
          interfaceAbi = await getSolidityReferenceInterfaceAbi(interfaceName);
          interfaceId = createInterfaceId(interfaceAbi as Abi);

          for (const fn of interfaceAbi) {
            const sig = toFunctionSignature(fn);
            const selector = toFunctionSelector(fn);
            this.addTest(
              it(`implements ${sig}`, () => {
                expect(
                  getAbiItem({ abi: deployedContract.abi, name: selector })
                ).not.toBeUndefined();
              })
            );
          }
        });

        describe("ERC165's supportsInterface(bytes4)", () => {
          it("uses less than 30k gas [skip-on-coverage]", async () => {
            const publicClient = await hre.viem.getPublicClient();

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
