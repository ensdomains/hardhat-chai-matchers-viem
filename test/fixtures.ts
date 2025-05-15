import hre from "hardhat";

export async function deployMatchers() {
  const networkConnection = await hre.network.connect();
  const matchers = await networkConnection.viem.deployContract("Matchers", []);
  return { matchers, networkConnection };
}

export async function deployEvents() {
  const networkConnection = await hre.network.connect();
  const anotherContract = await networkConnection.viem.deployContract(
    "AnotherContract",
    []
  );
  const events = await networkConnection.viem.deployContract("Events", [
    anotherContract.address,
  ]);
  const matchers = await networkConnection.viem.deployContract("Matchers", []);

  return { anotherContract, events, matchers, networkConnection };
}

export async function deployBehaviour() {
  const networkConnection = await hre.network.connect();
  const accounts = await networkConnection.viem
    .getWalletClients()
    .then((clients) => clients.map((c) => c.account));
  const behaviour = await networkConnection.viem.deployContract(
    "Behaviour",
    []
  );
  return { behaviour, accounts, networkConnection };
}
