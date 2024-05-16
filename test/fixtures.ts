import hre from "hardhat";

export async function deployMatchers() {
  const matchers = await hre.viem.deployContract("Matchers", []);
  return { matchers };
}

export async function deployEvents() {
  const anotherContract = await hre.viem.deployContract("AnotherContract", []);
  const events = await hre.viem.deployContract("Events", [
    anotherContract.address,
  ]);
  const matchers = await hre.viem.deployContract("Matchers", []);

  return { anotherContract, events, matchers };
}
