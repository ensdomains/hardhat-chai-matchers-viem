//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISomethingWithStruct {
    struct AStruct {
        uint256 id;
    }

    function something(
        AStruct memory aStruct
    ) external pure returns (string memory);
}
