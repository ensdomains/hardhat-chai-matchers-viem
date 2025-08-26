import type { HookContext, NetworkHooks } from "hardhat/types/hooks";
import type { ChainType, NetworkConnection } from "hardhat/types/network";

import type { Chain, SendTransactionParameters } from "viem";
import { sendTransaction } from "viem/actions";
import { deployCustomContract } from "../../utils/deployCustomContract.js";
import { addChaiMatchers } from "../addChaiMatchers.js";

let isInitialized = false;
// @ts-expect-error - __vitest_worker__ is not typed
const isVitestEnvironment = () => globalThis["__vitest_worker__"] !== undefined;

async function networkHookHandler(): Promise<Partial<NetworkHooks>> {
  const handlers: Partial<NetworkHooks> = {
    async newConnection<ChainTypeT extends ChainType | string>(
      context: HookContext,
      next: (context: HookContext) => Promise<NetworkConnection<ChainTypeT>>
    ) {
      if (!isInitialized && isVitestEnvironment()) {
        await addChaiMatchers();
        isInitialized = true;
      }

      const connection = await next(context);

      const publicClient = await connection.viem.getPublicClient();
      const originalDeployContract = connection.viem.deployContract;
      const originalGetContractAt = connection.viem.getContractAt;

      const createFunctionProxy = async (
        originalFunction: (...args: any[]) => Promise<any>,
        ...args: any[]
      ) => {
        const client = (() => {
          const lastArg = args[args.length - 1];
          if (
            typeof lastArg === "object" &&
            "client" in lastArg &&
            "public" in lastArg.client
          )
            return lastArg.client.public;
          return publicClient;
        })();
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
                    client,
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
        result.arbitrary = (args: SendTransactionParameters<Chain>) => {
          const resultPromise = sendTransaction(publicClient, args) as any;
          resultPromise.__call_metadata = {
            functionName: ".arbitrary",
            args,
            client: publicClient,
            kind: "arbitrary",
            abi: result.abi,
            address: result.address,
          };
          return resultPromise;
        };

        result.client = publicClient;

        return result;
      };

      connection.viem.deployContract = async (...args: any[]) => {
        if (typeof args[0] === "string")
          return createFunctionProxy(originalDeployContract, ...args);
        return createFunctionProxy(deployCustomContract, connection, ...args);
      };
      connection.viem.getContractAt = async (...args: any[]) =>
        createFunctionProxy(originalGetContractAt as never, ...args);

      return connection;
    },
  };

  return handlers;
}

export default networkHookHandler;
