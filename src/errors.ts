import { HardhatPluginError } from "hardhat/plugins.js";

export class HardhatChaiMatchersError extends HardhatPluginError {
  constructor(message: string, parent?: Error) {
    super("hardhat-chai-viem-matchers", message, parent);
  }
}

/**
 * This class is used to assert assumptions in our implementation. Chai's
 * AssertionError should be used for user assertions.
 */
export class HardhatChaiMatchersAssertionError extends HardhatChaiMatchersError {
  constructor(message: string) {
    super(`Assertion error: ${message}`);
  }
}

export class HardhatChaiMatchersNonChainableMatcherError extends HardhatChaiMatchersError {
  constructor(matcherName: string, previousMatcherName: string) {
    super(
      `The matcher '${matcherName}' cannot be chained after '${previousMatcherName}'. For more information, please refer to the documentation at: https://hardhat.org/chaining-async-matchers.`
    );
  }
}
