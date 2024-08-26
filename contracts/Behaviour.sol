// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./IBehaviour.sol";
import "./IBehaviourOther.sol";

contract Behaviour is ERC1155, IBehaviour, IBehaviourOther {
  constructor() ERC1155("") {}

  function foo() external pure returns (string memory) {
    return "bar";
  }

  function bar() external pure returns (string memory) {
    return "foo";
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC1155, IERC165) returns (bool) {
    return
      interfaceId == type(IBehaviour).interfaceId ||
      interfaceId == type(IBehaviourOther).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function complex() external pure returns (OuterStruct memory) {
    return OuterStruct(InnerStruct(0));
  }

  function mint(address owner, uint256 id) external {
    _mint(owner, id, 1, "");
  } 
}
