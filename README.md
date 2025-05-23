# hardhat-chai-matchers-viem

## This plugin is based on the existing `@nomicfoundation/hardhat-chai-matchers`. If you are using ethers, you should use that instead.

### Installation

```bash
bun add @ensdomains/hardhat-chai-matchers-viem vitest
```

In your hardhat config:

```typescript
import HardhatChaiMatchersViem from "@ensdomains/hardhat-chai-matchers-viem";

const config = {
  // ...your config
  plugins: [
    // ...your other plugins
    HardhatChaiMatchersViem,
  ],
};
```

To run tests:

```bash
bun vitest
```

### Getting started

Deploy contracts with `deployContract` and query them with `expect` to use matchers from this plugin:

```typescript
import hre from "hardhat";
import { expect, test } from "vitest";

const connection = await hre.network.connect();

test("error", async () => {
  const example = await connection.viem.deployContract("ExampleContract", []);
  await expect(
    example.write.revertWithSomeCustomError()
  ).toBeRevertedWithCustomError("SomeCustomError");
});
```

You can also use existing contracts with `getContractAt`:

```typescript
import hre from "hardhat";
import { expect, test } from "vitest";

const connection = await hre.network.connect();
const contractAddresss = "0xabc..."; // from somewhere else

test("error", async () => {
  const example = await connection.viem.getContractAt(
    "ExampleContract",
    contractAddress
  );
  await expect(
    example.write.revertWithSomeCustomError()
  ).toBeRevertedWithCustomError("SomeCustomError");
});
```

To speed up tests, you should use hardhat fixtures:

```typescript
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { expect, test } from "vitest";

const connection = await hre.network.connect();

async function deployExample() {
  const example = await connection.viem.deployContract("ExampleContract", []);
  return example;
}

test("error", async () => {
  const example = await connection.networkHelpers.loadFixture(deployExample);
  await expect(
    example.write.revertWithSomeCustomError()
  ).toBeRevertedWithCustomError("SomeCustomError");
});
```

### Available matchers

```typescript
// match any revert
await expect(contractCall).toBeReverted();

// match custom error revert
await expect(contractCall)
  .toBeRevertedWithCustomError("YourError")
  // optional args matching
  .withArgs([...errorArgs]);

// match custom error from another contract
await expect(contractCall)
  .toBeRevertedWithCustomErrorFrom(otherContract, "OtherErrorName")
  // optional args matching
  .withArgs([...otherErrorArgs]);

// match revert without reason
await expect(contractCall).toBeRevertedWithoutReason();

// match revert with panic
await expect(contractCall)
  // panic code is optional
  .toBeRevertedWithPanic(panicCode);

// match revert with string (i.e. Error("reason"))
await expect(contractCall)
  // regex or string can be used to match reason
  .toBeRevertedWithString("reason");

// match emitted event
await expect(contractCall)
  .toEmitEvent("YourEvent")
  // optional args matching
  .withArgs([...eventArgs]);

// match emitted event from another contract
await expect(contractCall)
  .toEmitEventFrom(otherContract, "OtherEvent")
  // optional args matching
  .withArgs([...otherEventArgs]);

// match address value
expect(addressValue).toEqualAddress(otherAddressValue);
```
