import type { Fixture } from "@nomicfoundation/hardhat-network-helpers/types";
import type {
  DefaultChainType,
  NetworkConnection,
} from "hardhat/types/network";

export function createFixture<T>(
  networkConnection: NetworkConnection<DefaultChainType>,
  fixture: (n: NetworkConnection<DefaultChainType>) => Fixture<T>
) {
  const initialisedFixture = fixture(networkConnection);
  return async () =>
    networkConnection.networkHelpers.loadFixture(initialisedFixture);
}
