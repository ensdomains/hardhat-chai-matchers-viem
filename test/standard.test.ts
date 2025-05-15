import { expect } from "chai";
import { describe, it } from "vitest";
import { deployMatchers } from "./fixtures.js";
import { loadFixture } from "./helpers.js";

describe("standard", () => {
  it("should allow asserting against resolved data", async () => {
    const { matchers } = await loadFixture(deployMatchers);
    await expect(matchers.read.succeedsView()).resolves.toBe(0n);
  });
});
