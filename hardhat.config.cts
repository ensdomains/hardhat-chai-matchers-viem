import "@nomicfoundation/hardhat-viem";
import { HardhatUserConfig } from "hardhat/config";

// hardhat actions
import "./tasks/esm_fix.cjs";

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
    },
    localhost: {
      url: `http://127.0.0.1:${process.env.HARDHAT_NODE_PORT}`,
    },
  },
} satisfies HardhatUserConfig;

export default config;
