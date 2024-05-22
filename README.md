# hardhat-chai-matchers-viem

## This plugin is based on the existing `@nomicfoundation/hardhat-chai-matchers`. If you are using ethers, you should use that instead.

### Installation

```bash
bun add @ensdomains/hardhat-chai-matchers-viem
```

In your hardhat config:

```typescript
import("@ensdomains/hardhat-chai-matchers-viem");
```

### Getting started

Deploy contracts with `deployContract` and pass them into `expect` to use matchers from this plugin:

```typescript
import { expect } from "chai";
import hre from "hardhat";

it("works", async () => {
  const example = await hre.viem.deployContract("ExampleContract", []);
  await expect(example)
    .write("revertWithSomeCustomError")
    .toBeRevertedWithCustomError("SomeCustomError");
});
```

To speed up tests, you should use hardhat fixtures:

```typescript
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";

async function deployExample() {
  const example = await hre.viem.deployContract("ExampleContract", []);
  return example;
}

it("works", async () => {
  const example = await loadFixture(deployExample);
  await expect(example)
    .write("revertWithSomeCustomError")
    .toBeRevertedWithCustomError("SomeCustomError");
});
```

### Available matchers

- `expect(contract).read(...)`
- `expect(contract).write(...)`
- `expect(contract).transaction(...)`
- `.toBeReverted()`
- `.toBeRevertedWithCustomError(...)`
  - `.withArgs(...)`
- `.toBeRevertedWithoutReason()`
- `.toBeRevertedWithPanic(...)`
- `.toBeRevertedWithString(...)`
- `.toEmitEvent(...)`
  - `.withArgs(...)`
- `.toEmitEventFrom(...)`
  - `.withArgs(...)`
