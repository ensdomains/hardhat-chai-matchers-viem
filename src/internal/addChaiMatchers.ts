import { chai } from "vitest";

import { hardhatChaiMatchers } from "../matchers.js";

export function addChaiMatchers() {
  chai.use(hardhatChaiMatchers);
}
