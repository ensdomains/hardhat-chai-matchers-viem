import { hardhatChaiMatchers } from "../matchers.js";

export async function addChaiMatchers() {
  const { chai } = await import("vitest");
  chai.use(hardhatChaiMatchers);
}
