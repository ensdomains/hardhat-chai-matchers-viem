import type { HardhatUserConfig } from "hardhat/config";

import hardhatChaiMatchersViemPlugin from "@ensdomains/hardhat-chai-matchers-viem";
import networkHelpersPlugin from "@nomicfoundation/hardhat-network-helpers";
import nodeTestPlugin from "@nomicfoundation/hardhat-node-test-runner";
import hardhatViemPlugin from "@nomicfoundation/hardhat-viem";

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      metadata: {
        useLiteralContent: true,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: Number(process.env.CHAIN_ID ?? "31337"),
      type: "edr",
    },
    localhost: {
      url: `http://127.0.0.1:${process.env.HARDHAT_NODE_PORT ?? "8545"}`,
      type: "http",
    },
  },
  plugins: [
    nodeTestPlugin,
    hardhatViemPlugin,
    networkHelpersPlugin,
    hardhatChaiMatchersViemPlugin,
  ],
} satisfies HardhatUserConfig;

export default config;
