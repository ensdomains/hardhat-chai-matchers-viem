import type {
  DefaultChainType,
  NetworkConnection,
} from "hardhat/types/network";

export function createDeployMatchersFixture(
  networkConnection: NetworkConnection<DefaultChainType>
) {
  return async function matchersFixture() {
    const matchers = await networkConnection.viem.deployContract(
      "Matchers",
      []
    );
    return { matchers };
  };
}

export function createDeployEventsFixture(
  networkConnection: NetworkConnection<DefaultChainType>
) {
  return async function eventsFixture() {
    const anotherContract = await networkConnection.viem.deployContract(
      "AnotherContract",
      []
    );
    const events = await networkConnection.viem.deployContract("Events", [
      anotherContract.address,
    ]);
    const matchers = await networkConnection.viem.deployContract(
      "Matchers",
      []
    );

    return { anotherContract, events, matchers };
  };
}

export function createDeployBehaviourFixture(
  networkConnection: NetworkConnection<DefaultChainType>
) {
  return async function behaviourFixture() {
    const accounts = await networkConnection.viem
      .getWalletClients()
      .then((clients) => clients.map((c) => c.account));
    const behaviour = await networkConnection.viem.deployContract(
      "Behaviour",
      []
    );
    return { behaviour, accounts };
  };
}
