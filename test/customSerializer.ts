import { stripVTControlCharacters } from "node:util";
import { SnapshotSerializer } from "vitest";

export default {
  serialize(val, config, indentation, depth, refs, printer) {
    if ("__no_color" in val) return val;
    const newMessage = stripVTControlCharacters(val.message);
    Object.assign(val, { message: newMessage, __no_color: true });
    // `printer` is a function that serializes a value using existing plugins.
    return printer(val, config, indentation, depth, refs);
  },
  test(val) {
    return (
      val &&
      val instanceof Error &&
      val.name === "AssertionError" &&
      !("__no_color" in val)
    );
  },
} satisfies SnapshotSerializer;
