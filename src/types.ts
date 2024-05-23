import "@nomicfoundation/hardhat-viem";

import type {
  AbiError,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  ExtractAbiError,
  ExtractAbiErrorNames,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from "abitype";
import type { Abi, Address, Hash } from "viem";
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

interface EventAssertion<abiEvent extends AbiEvent = AbiEvent>
  extends AsyncAssertion {
  withArgs: (
    ...args: AbiParametersToPrimitiveTypes<abiEvent["inputs"]>
  ) => Promise<void>;
}

interface ReadCallAssertion<
  contract extends AnyContract,
  readFunction extends
    | ((args: any, options?: any) => any)
    | ((options?: any) => any),
  isNegated extends boolean = false,
  abi extends Abi | readonly unknown[] = contract["abi"]
> extends RevertAssertion<contract, abi> {
  not: isNegated extends true
    ? never
    : ReadCallAssertion<contract, readFunction, true, abi>;
}

export interface WriteCallAssertion<
  contract extends AnyContract,
  isNegated extends boolean = false,
  abi extends Abi | readonly unknown[] = contract["abi"]
> extends RevertAssertion<contract, abi>,
    EmitEventAssertion<contract, abi> {
  not: isNegated extends true ? never : WriteCallAssertion<contract, true, abi>;
}

interface TransactionHashAssertion<
  contract extends AnyContract,
  isNegated extends boolean = false,
  abi extends Abi | readonly unknown[] = contract["abi"]
> extends EmitEventAssertion<contract, abi> {
  not: isNegated extends true
    ? never
    : TransactionHashAssertion<contract, true, abi>;
}

type ToBigInt<TNumber extends number> =
  `${TNumber}` extends `${infer V extends bigint}` ? V : never;

interface RevertAssertion<
  contract extends AnyContract,
  abi extends Abi | readonly unknown[] = contract["abi"]
> {
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

interface EmitEventAssertion<
  contract extends AnyContract,
  abi extends Abi | readonly unknown[] = contract["abi"]
> {
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

type CreateReadCallAssertion<contract extends AnyContract> = contract extends {
  read: any;
}
  ? <
      readFunction extends keyof contract["read"],
      argsAndOptions extends ParametersOrNever<contract["read"][readFunction]>
    >(
      functionName: readFunction,
      ...argsAndOptions: argsAndOptions
    ) => contract["read"][readFunction] extends
      | ((args: any, options?: any) => any)
      | ((options?: any) => any)
      ? ReadCallAssertion<contract, contract["read"][readFunction]>
      : never
  : never;

type CreateWriteCallAssertion<contract extends AnyContract> = contract extends {
  write: any;
}
  ? <
      writeFunction extends keyof contract["write"],
      argsAndOptions extends ParametersOrNever<contract["write"][writeFunction]>
    >(
      functionName: writeFunction,
      ...argsAndOptions: argsAndOptions
    ) => WriteCallAssertion<contract>
  : never;

interface CreateTransactionAssertion<contract extends AnyContract> {
  (hash: Hash): TransactionHashAssertion<contract>;
  (transactionPromise: Promise<Hash>): WriteCallAssertion<contract>;
}

interface ExpectContract<contract extends AnyContract> {
  read: CreateReadCallAssertion<contract>;
  write: CreateWriteCallAssertion<contract>;
  transaction: CreateTransactionAssertion<contract>;
}

type Promisify<O> = {
  [K in keyof O]: O[K] extends (...args: infer A) => infer R
    ? O extends R
      ? Promisify<O[K]>
      : (...args: A) => Promise<R>
    : O[K];
};

interface Assertion123<T = unknown, isNegated extends boolean = false>
  extends JestAssertion<T> {
  resolves: Promisify<Assertion123<Awaited<T> extends never ? T : Awaited<T>>>;
  rejects: Promisify<Assertion123<Awaited<T> extends never ? T : Awaited<T>>>;
  toEqual: (expected: Awaited<T> extends never ? T : Awaited<T>) => void;
  not: isNegated extends true ? never : Assertion123<T, true>;
}

declare global {
  namespace Chai {
    interface ExpectStatic {
      <contract extends AnyContract>(
        contract: contract
      ): ExpectContract<contract>;
      <T>(actual: T, message?: string): Assertion123<T>;
      anyValue: AnyValue;
    }
  }
}
