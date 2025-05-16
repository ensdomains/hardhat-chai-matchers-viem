import "@nomicfoundation/hardhat-viem";

import type {
  ConstructorArgs,
  ContractAbis,
  DeployContractConfig,
  GetContractAtConfig,
  GetContractReturnType,
  HardhatViemHelpers as HardhatViemHelpers_,
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
import type { Artifact } from "hardhat/types/artifacts";
import type {
  Abi,
  Address,
  ContractConstructorArgs,
  PublicClient,
  WriteContractReturnType,
} from "viem";
import type { anyValueSymbol, panicReasons } from "./constants.js";

interface Constructable<T> {
  new (...args: any[]): T;
}

type ExtendsOrNever<TCompare, TBase, TFunc> = TCompare extends TBase
  ? TFunc
  : never;

interface JestAssertion<T = unknown> {
  toStrictEqual: (expected: T) => void;
  toBe: (expected: T) => void;
  toMatch: (expected: string | RegExp) => void;
  toMatchObject: ExtendsOrNever<T, {} | any[], (expected: T) => void>;
  toContain: ExtendsOrNever<T, any[], (item: T[keyof T]) => void>;
  toContainEqual: ExtendsOrNever<T, any[], (item: T[keyof T]) => void>;
  toBeTruthy: () => void;
  toBeFalsy: () => void;
  toBeGreaterThan: ExtendsOrNever<T, number | bigint, (num: T) => void>;
  toBeGreaterThanOrEqual: ExtendsOrNever<T, number | bigint, (num: T) => void>;
  toBeLessThan: ExtendsOrNever<T, number | bigint, (num: T) => void>;
  toBeLessThanOrEqual: ExtendsOrNever<T, number | bigint, (num: T) => void>;
  toBeNaN: () => void;
  toBeUndefined: () => void;
  toBeNull: () => void;
  toBeDefined: () => void;
  toBeInstanceOf: (expected: Constructable<T>) => void;
  toBeCalledTimes: (times: number) => void;
  toHaveLength: (length: number) => void;
  toHaveProperty: ExtendsOrNever<
    T,
    object,
    <key extends keyof T>(property: key, value?: T[key]) => void
  >;
  toBeCloseTo: ExtendsOrNever<
    T,
    number,
    (number: T, numDigits?: number) => void
  >;
  toThrow: (expected?: string | Constructable<any> | RegExp | Error) => void;
  toThrowError: (
    expected?: string | Constructable<any> | RegExp | Error
  ) => void;
  toReturn: () => void;
  toHaveReturned: () => void;
  toReturnTimes: (times: number) => void;
  toHaveReturnedTimes: (times: number) => void;
  toReturnWith: <E>(value: E) => void;
  toHaveReturnedWith: <E>(value: E) => void;
  toHaveLastReturnedWith: <E>(value: E) => void;
  lastReturnedWith: <E>(value: E) => void;
  toHaveNthReturnedWith: <E>(nthCall: number, value: E) => void;
  nthReturnedWith: <E>(nthCall: number, value: E) => void;
  toEqualAddress: ExtendsOrNever<T, Address, (address: Address) => void>;
}

export type AnyContract = { abi: Abi | unknown[]; address: Address };

export type AnyValue = typeof anyValueSymbol;

interface AsyncAssertion extends Promise<void> {}

interface ErrorAssertion<
  abiError extends AbiError = AbiError,
  args extends readonly unknown[] = AbiParametersToPrimitiveTypes<
    abiError["inputs"]
  >
> extends AsyncAssertion {
  withArgs: (
    ...args: { [arg in keyof args]: args[arg] | AnyValue }
  ) => Promise<void>;
}

interface EventAssertion<
  abiEvent extends AbiEvent = AbiEvent,
  args extends readonly unknown[] = AbiParametersToPrimitiveTypes<
    abiEvent["inputs"]
  >
> extends AsyncAssertion {
  withArgs: (
    ...args: { [arg in keyof args]: args[arg] | AnyValue }
  ) => Promise<void>;
}

interface ReadCallAssertion<
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

interface TransactionHashAssertion<
  abi extends Abi | readonly unknown[],
  isNegated extends boolean = false
> extends EmitEventAssertion<abi> {
  not: isNegated extends true ? never : TransactionHashAssertion<abi, true>;
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

type ParametersOrNever<T> = T extends (...args: infer A) => any ? A : never;

type Promisify<O> = {
  [K in keyof O]: O[K] extends (...args: infer A) => infer R
    ? O extends R
      ? Promisify<O[K]>
      : (...args: A) => Promise<R>
    : O[K];
};

interface GenericAssertion<T = unknown, isNegated extends boolean = false>
  extends JestAssertion<T> {
  resolves: Promisify<
    GenericAssertion<Awaited<T> extends never ? T : Awaited<T>>
  >;
  rejects: Promisify<
    GenericAssertion<Awaited<T> extends never ? T : Awaited<T>>
  >;
  toEqual: (expected: Awaited<T> extends never ? T : Awaited<T>) => void;
  not: isNegated extends true ? never : GenericAssertion<T, true>;
}

export type PromiseWithCallMetadata<
  T,
  TFunctionName extends string,
  TArgs extends unknown[],
  TKind extends "write" | "read",
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

type ContractReturnType<
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
    : unknown);

interface DeployContract {
  <ContractName extends keyof ContractAbis>(
    contractName: ContractName,
    constructorArgs?: ConstructorArgs<ContractName>,
    deployContractConfig?: DeployContractConfig
  ): Promise<ContractReturnType<ContractAbis[ContractName]>>;
  <ContractArtifact extends Artifact>(
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

declare global {
  namespace Chai {
    interface ExpectStatic {
      <
        const TResult,
        const TFunctionName extends string,
        const TArgs extends unknown[],
        const TKind extends "write" | "read",
        const TAbi extends Abi | readonly unknown[],
        const TAddress extends Address
      >(
        call: PromiseWithCallMetadata<
          TResult,
          TFunctionName,
          TArgs,
          TKind,
          TAbi,
          TAddress
        >
      ): (TKind extends "write"
        ? WriteCallAssertion<TAbi>
        : ReadCallAssertion<TAbi>) &
        GenericAssertion<
          PromiseWithCallMetadata<
            TResult,
            TFunctionName,
            TArgs,
            TKind,
            TAbi,
            TAddress
          >
        >;
      <T>(actual: T, message?: string): GenericAssertion<T>;
      anyValue: AnyValue;
    }
  }
}
