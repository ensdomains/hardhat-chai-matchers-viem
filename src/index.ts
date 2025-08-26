import type { HardhatPlugin } from "hardhat/types/plugins";

import "./types/hardhat.js";
import "./types/vitest.js";

const hardhatChaiMatchersViemPlugin: HardhatPlugin = {
  id: "hardhat-chai-matchers-viem",
  hookHandlers: {
    network: async () => import("./internal/hook-handlers/network.js"),
  },
  npmPackage: "@ensdomains/hardhat-chai-matchers-viem",
  dependencies: () => [import("@nomicfoundation/hardhat-viem")],
};

export default hardhatChaiMatchersViemPlugin;

export type * from "./types.js";
