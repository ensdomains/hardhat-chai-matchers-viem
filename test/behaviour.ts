import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { shouldSupportInterfaces } from "../src/behaviour/shouldSupportInterfaces.js";
import { deployBehaviour } from "./fixtures.js";

describe("Behaviour", () => {
  shouldSupportInterfaces({
    contract: () =>
      loadFixture(deployBehaviour).then(({ behaviour }) => behaviour),
    interfaces: ["IBehaviour", "IBehaviourOther"],
  });
});
