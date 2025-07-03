// Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.1.0/test/token/ERC1155/ERC1155.behaviour.js
// Copyright (c) 2016-2020 zOS Global Limited

import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import type { ArtifactMap } from "hardhat/types/artifacts";
import {
  encodeFunctionData,
  getAbiItem,
  toFunctionSelector,
  toFunctionSignature,
  type Abi,
  type Address,
  type PublicClient,
} from "viem";
import { beforeAll, describe, expect, it } from "vitest";

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
    client: PublicClient;
    read: {
      supportsInterface: SupportsInterfaceContract["read"]["supportsInterface"];
    };
  }
>({
  contract,
  interfaces,
}: {
  contract: () => TContract | Promise<TContract>;
  interfaces: (keyof ArtifactMap)[];
}) => {
  describe("Contract interface", async function () {
    let deployedContract: TContract;

    beforeAll(async () => {
      deployedContract = await contract();
    });

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
            await expect(
              deployedContract.client.estimateGas({
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
