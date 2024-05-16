import { JestChaiExpect } from "@vitest/expect";
import { use } from "chai";
import { hardhatChaiMatchers } from "./matchers.js";

use(JestChaiExpect);
use(hardhatChaiMatchers);
