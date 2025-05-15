import hre from "hardhat";
import { describe } from "vitest";

import { shouldSupportInterfaces } from "@ensdomains/hardhat-chai-matchers-viem/behaviour";
import { createDeployBehaviourFixture } from "./fixtures.js";
import { createFixture } from "./helpers.js";

const networkConnection = await hre.network.connect();
const loadBehaviourFixture = createFixture(
  networkConnection,
  createDeployBehaviourFixture
);

describe("Behaviour", () => {
  shouldSupportInterfaces({
    contract: () => loadBehaviourFixture().then(({ behaviour }) => behaviour),
    interfaces: ["IBehaviour", "IBehaviourOther"],
  });
});
