import { JestChaiExpect } from "@vitest/expect";
import { use } from "chai";
import { hardhatChaiMatchers } from "../matchers.js";
import "../types.js";

export function addChaiMatchers() {
  use(JestChaiExpect);
  use(hardhatChaiMatchers);
}
