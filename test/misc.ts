import { expect } from "chai";
import "../src/index.js";

describe("misc", () => {
  describe("toEqualAddress", () => {
    it("matching address", () => {
      const addressA = "0x1234567890123456789012345678901234567890" as const;
      expect(addressA).toEqualAddress(addressA);
    });
    it("mismatching address", () => {
      const addressA = "0x1234567890123456789012345678901234567890" as const;
      const addressB = "0x0000567890123456789012345678901234567890" as const;
      expect(() => {
        expect(addressA).toEqualAddress(addressB);
      }).toThrowError(
        "expected 0x1234567890123456789012345678901234567890 to equal address 0x0000567890123456789012345678901234567890"
      );
    });
    it("matching address - negated", () => {
      const addressA = "0x1234567890123456789012345678901234567890" as const;
      expect(() => {
        expect(addressA).not.toEqualAddress(addressA);
      }).toThrowError(
        "expected 0x1234567890123456789012345678901234567890 not to equal address 0x1234567890123456789012345678901234567890"
      );
    });
    it("mismatching address - negated", () => {
      const addressA = "0x1234567890123456789012345678901234567890" as const;
      const addressB = "0x0000567890123456789012345678901234567890" as const;
      expect(addressA).not.toEqualAddress(addressB);
    });
  });
});
