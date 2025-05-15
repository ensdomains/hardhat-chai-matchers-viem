import { describe } from "vitest";

import { shouldSupportInterfaces } from "../src/behaviour/shouldSupportInterfaces.js";
import { deployBehaviour } from "./fixtures.js";

describe("Behaviour", () => {
  shouldSupportInterfaces({
    contract: (networkConnection) =>
      networkConnection.networkHelpers
        .loadFixture(deployBehaviour)
        .then(({ behaviour }) => behaviour),
    interfaces: ["IBehaviour", "IBehaviourOther"],
  });
});
