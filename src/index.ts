import type { HardhatPlugin } from "hardhat/types/plugins";

import "./types.js";

const hardhatChaiMatchersViemPlugin: HardhatPlugin = {
  id: "hardhat-chai-matchers-viem",
  hookHandlers: {
    network: import.meta.resolve("./internal/hook-handlers/network.js"),
  },
  npmPackage: "@ensdomains/hardhat-chai-matchers-viem",
  dependencies: [
    async () => {
      const { default: hardhatViemPlugin } = await import(
        "@nomicfoundation/hardhat-viem"
      );
      return hardhatViemPlugin;
    },
  ],
};

export default hardhatChaiMatchersViemPlugin;
