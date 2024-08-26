//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

struct InnerStruct {
  uint256 id;
}

struct OuterStruct {
  InnerStruct inner;
}

interface IBehaviour is IERC1155 {
    function foo() external pure returns (string memory); 
    function complex() external pure returns (OuterStruct memory);
}
