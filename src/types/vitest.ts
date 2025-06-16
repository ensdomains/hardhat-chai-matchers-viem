import type { Abi, Address } from "viem";
import type {
  PromiseWithCallMetadata,
  ReadCallAssertion,
  WriteCallAssertion,
} from "../types.js";

type ExtendsOrNever<TCompare, TBase, TFunc> = TCompare extends TBase
  ? TFunc
  : Awaited<TCompare> extends TBase
  ? TFunc
  : never;

interface AddressMatcher<T = unknown> {
  toEqualAddress: ExtendsOrNever<T, Address, (address: Address) => void>;
}

declare module "vitest" {
  interface Assertion<T = any> extends AddressMatcher<T> {}
  interface ExpectStatic {
    <
      const TResult,
      const TFunctionName extends string,
      const TArgs extends unknown[],
      const TKind extends "write" | "read" | "arbitrary",
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
      : TKind extends "read"
      ? ReadCallAssertion<TAbi>
      : TKind extends "arbitrary"
      ? WriteCallAssertion<TAbi>
      : {}) &
      Assertion<
        PromiseWithCallMetadata<
          TResult,
          TFunctionName,
          TArgs,
          TKind,
          TAbi,
          TAddress
        >
      >;
    <T>(actual: T, message?: string): Assertion<T>;
  }
}
