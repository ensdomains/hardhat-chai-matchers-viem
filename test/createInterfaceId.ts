import { expect } from "chai";
import type { ArtifactsMap } from "hardhat/types/artifacts.js";
import "../src/index.js";
import { getSolidityReferenceInterfaceAbi } from "../src/utils/createInterfaceId.js";

describe("getSolidityReferenceInterfaceAbi", () => {
  const interfaceName = "IBehaviour" satisfies keyof ArtifactsMap;

  it("should return explicitly defined functions", async () => {
    const abi = await getSolidityReferenceInterfaceAbi(interfaceName);

    expect(abi.length).toEqual(2);
    expect(abi[0]).toEqual({
      name: "foo",
      type: "function",
      stateMutability: "pure",
      inputs: [],
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    });
    expect(abi[1]).toEqual({
      name: "complex",
      type: "function",
      stateMutability: "pure",
      inputs: [],
      outputs: [
        {
          components: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              internalType: "struct InnerStruct",
              name: "inner",
              type: "tuple",
            },
          ],
          internalType: "struct OuterStruct",
          name: "",
          type: "tuple",
        },
      ],
    });
  });

  it("should allow using fully qualified name", async () => {
    const abi = await getSolidityReferenceInterfaceAbi(
      "contracts/IBehaviour.sol:IBehaviour"
    );
    expect(abi.length).toEqual(2);
  });

  it("should throw error for non-existent interface", async () => {
    const nonExistentInterface = "NonExistentInterface" as keyof ArtifactsMap;
    await expect(
      getSolidityReferenceInterfaceAbi(nonExistentInterface)
    ).rejects.toThrow(
      'HH700: Artifact for contract "NonExistentInterface" not found.'
    );
  });
});
