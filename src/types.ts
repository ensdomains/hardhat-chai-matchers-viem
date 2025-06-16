import "vitest";

import type {
  ContractAbis,
  GetContractReturnType,
} from "@nomicfoundation/hardhat-viem/types";
import type {
  AbiError,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  ExtractAbiError,
  ExtractAbiErrorNames,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from "abitype";
import type {
  Abi,
  AbiEventParametersToPrimitiveTypes,
  Address,
  Chain,
  Hex,
  PublicClient,
  SendTransactionParameters,
  SendTransactionReturnType,
  WriteContractReturnType,
} from "viem";
import type { panicReasons } from "./constants.js";

export type AnyArtifact<abi extends Abi = Abi> = {
  abi: abi;
  bytecode: Hex;
};

type ContractEventArgs<abiEvent extends AbiEvent = AbiEvent> =
  AbiEventParametersToPrimitiveTypes<
    abiEvent["inputs"],
    { EnableUnion: false; IndexedOnly: false; Required: true }
  > extends infer args
    ? [args] extends [never]
      ? readonly unknown[] | Record<string, unknown>
      : args
    : readonly unknown[] | Record<string, unknown>;

export type AnyContract = { abi: Abi | unknown[]; address: Address };

interface AsyncAssertion extends Promise<void> {}

interface ErrorAssertion<
  abiError extends AbiError = AbiError,
  args extends readonly unknown[] = AbiParametersToPrimitiveTypes<
    abiError["inputs"]
  >
> extends AsyncAssertion {
  withArgs: (args: args) => Promise<void>;
}

interface EventAssertion<
  abiEvent extends AbiEvent = AbiEvent,
  args extends ContractEventArgs<abiEvent> = ContractEventArgs<abiEvent>
> extends AsyncAssertion {
  withArgs: (args: args) => Promise<void>;
}

export interface ReadCallAssertion<
  abi extends Abi | readonly unknown[],
  isNegated extends boolean = false
> extends RevertAssertion<abi> {
  not: isNegated extends true ? never : ReadCallAssertion<abi, true>;
}

export interface WriteCallAssertion<
  abi extends Abi | readonly unknown[],
  isNegated extends boolean = false
> extends RevertAssertion<abi>,
    EmitEventAssertion<abi> {
  not: isNegated extends true ? never : WriteCallAssertion<abi, true>;
}

type ToBigInt<TNumber extends number> =
  `${TNumber}` extends `${infer V extends bigint}` ? V : never;

interface RevertAssertion<abi extends Abi | readonly unknown[]> {
  toBeReverted: () => Promise<void>;
  toBeRevertedWithoutReason: () => Promise<void>;
  toBeRevertedWithString: (expected: string | RegExp) => Promise<void>;
  toBeRevertedWithPanic: (
    code?: ToBigInt<keyof typeof panicReasons>
  ) => Promise<void>;

  toBeRevertedWithCustomError: <
    errorsAbi extends Abi | readonly unknown[] = abi,
    errorNames extends string = errorsAbi extends Abi
      ? ExtractAbiErrorNames<errorsAbi>
      : string
  >(
    errorName: errorNames
  ) => ErrorAssertion<
    ExtractAbiError<errorsAbi extends Abi ? errorsAbi : Abi, errorNames>
  >;
  toBeRevertedWithCustomErrorFrom: <
    specifiedContract extends AnyContract,
    errorsAbi extends Abi | readonly unknown[] = specifiedContract["abi"],
    errorNames extends errorsAbi extends Abi
      ? ExtractAbiErrorNames<errorsAbi>
      : string = errorsAbi extends Abi
      ? ExtractAbiErrorNames<errorsAbi>
      : string
  >(
    contract: specifiedContract,
    errorName: errorNames
  ) => ErrorAssertion<
    ExtractAbiError<errorsAbi extends Abi ? errorsAbi : Abi, errorNames>
  >;
}

interface EmitEventAssertion<abi extends Abi | readonly unknown[]> {
  toEmitEvent: <
    eventsAbi extends Abi | readonly unknown[] = abi,
    eventNames extends eventsAbi extends Abi
      ? ExtractAbiEventNames<eventsAbi>
      : string = eventsAbi extends Abi
      ? ExtractAbiEventNames<eventsAbi>
      : string
  >(
    eventName: eventNames
  ) => EventAssertion<
    ExtractAbiEvent<eventsAbi extends Abi ? eventsAbi : Abi, eventNames>
  >;
  toEmitEventFrom: <
    specifiedContract extends AnyContract,
    eventsAbi extends Abi | readonly unknown[] = specifiedContract["abi"],
    eventNames extends eventsAbi extends Abi
      ? ExtractAbiEventNames<eventsAbi>
      : string = eventsAbi extends Abi
      ? ExtractAbiEventNames<eventsAbi>
      : string
  >(
    contract: specifiedContract,
    eventName: eventNames
  ) => EventAssertion<
    ExtractAbiEvent<eventsAbi extends Abi ? eventsAbi : Abi, eventNames>
  >;
}

export type PromiseWithCallMetadata<
  T,
  TFunctionName extends string,
  TArgs extends unknown[],
  TKind extends "write" | "read" | "arbitrary",
  TAbi extends Abi | readonly unknown[],
  TAddress extends Address
> = Promise<T> & {
  __call_metadata: {
    functionName: TFunctionName;
    args: TArgs;
    client: PublicClient;
    kind: TKind;
    abi: TAbi;
    address: TAddress;
  };
};

export type UnknownCallPromise<
  T,
  K extends "read" | "write"
> = PromiseWithCallMetadata<T, string, unknown[], K, Abi, Address>;
export type UnknownReadPromise = UnknownCallPromise<unknown, "read">;
export type UnknownWritePromise = UnknownCallPromise<unknown, "write">;

type GetParametersWithNestedKey<T, K, Kn> = K extends keyof T
  ? Kn extends keyof T[K]
    ? T[K][Kn] extends (...args: infer A) => any
      ? A
      : never
    : never
  : never;
type GetReturnTypeWithNestedKey<T, K, Kn> = K extends keyof T
  ? Kn extends keyof T[K]
    ? T[K][Kn] extends (...args: any[]) => Promise<infer R>
      ? R
      : never
    : never
  : never;

export type ContractReturnType<
  abi extends Abi,
  _GetContractReturnType extends GetContractReturnType<abi> = GetContractReturnType<abi>
> = Omit<_GetContractReturnType, "write" | "read"> & {
  client: PublicClient;
} & ("write" extends keyof _GetContractReturnType
    ? {
        write: {
          [key in keyof _GetContractReturnType["write"]]: <
            const TParams extends GetParametersWithNestedKey<
              _GetContractReturnType,
              "write",
              key
            >
          >(
            ...parameters: TParams
          ) => PromiseWithCallMetadata<
            WriteContractReturnType,
            key extends string ? key : never,
            TParams extends [infer TFirst, ...unknown[]]
              ? TFirst extends unknown[]
                ? TFirst
                : never
              : never,
            "write",
            _GetContractReturnType["abi"],
            _GetContractReturnType["address"]
          >;
        };
      }
    : unknown) &
  ("read" extends keyof _GetContractReturnType
    ? {
        read: {
          [key in keyof _GetContractReturnType["read"]]: <
            const TParams extends GetParametersWithNestedKey<
              _GetContractReturnType,
              "read",
              key
            >
          >(
            ...parameters: TParams
          ) => PromiseWithCallMetadata<
            GetReturnTypeWithNestedKey<_GetContractReturnType, "read", key>,
            key extends string ? key : never,
            TParams extends [infer TFirst, ...unknown[]]
              ? TFirst extends unknown[]
                ? TFirst
                : never
              : never,
            "read",
            _GetContractReturnType["abi"],
            _GetContractReturnType["address"]
          >;
        };
      }
    : unknown) & {
    arbitrary: (
      parameters: SendTransactionParameters<Chain>
    ) => PromiseWithCallMetadata<
      SendTransactionReturnType,
      ".arbitrary",
      [SendTransactionParameters],
      "arbitrary",
      _GetContractReturnType["abi"],
      _GetContractReturnType["address"]
    >;
  };

export type NamedContractReturnType<
  name extends keyof ContractAbis,
  abi extends ContractAbis[name] = ContractAbis[name]
> = ContractReturnType<abi>;
