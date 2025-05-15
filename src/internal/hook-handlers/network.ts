import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";

import { addChaiMatchers } from "../addChaiMatchers.js";

let isInitialized = false;

type PromiseWithMetadata<TMetadata, TValue> = Promise<TValue> & TMetadata;

export default async (): Promise<Partial<NetworkHooks>> => {
  const handlers: Partial<NetworkHooks> = {
    async newConnection<ChainTypeT extends ChainType | string>(
      context: HookContext,
      next: (context: HookContext) => Promise<NetworkConnection<ChainTypeT>>
    ) {
      if (!isInitialized) {
        addChaiMatchers();
        isInitialized = true;
      }

      const connection = await next(context);

      const publicClient = await connection.viem.getPublicClient();
      const originalDeployContract = connection.viem.deployContract;
      const originalGetContractAt = connection.viem.getContractAt;

      const createFunctionProxy = async (
        originalFunction: (
          ...args: any[]
        ) => ReturnType<typeof originalDeployContract>,
        ...args: any[]
      ) => {
        const result = await originalFunction(...args);
        const createMetadataProxy = (
          original: unknown,
          kind: "write" | "read"
        ) =>
          new Proxy(
            {},
            {
              get(_, functionName) {
                return (...args: any[]) => {
                  const resultPromise = (original as any)[
                    functionName as string
                  ](...args);
                  resultPromise.__call_metadata = {
                    functionName,
                    args,
                    client: publicClient,
                    kind,
                    abi: result.abi,
                    address: result.address,
                  };
                  return resultPromise;
                };
              },
            }
          );
        if ("write" in result) {
          const originalWrite = result.write;
          result.write = createMetadataProxy(originalWrite, "write");
        }
        if ("read" in result) {
          const originalRead = result.read;
          result.read = createMetadataProxy(originalRead, "read");
        }

        result.client = publicClient;

        return result;
      };

      connection.viem.deployContract = async (...args) =>
        createFunctionProxy(originalDeployContract, ...args);
      connection.viem.getContractAt = async (...args) =>
        createFunctionProxy(originalGetContractAt, ...args);

      return connection;
    },
  };

  return handlers;
};
