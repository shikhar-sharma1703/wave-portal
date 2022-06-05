// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    // Events in solidity
    event NewWave(address indexed from, uint256 timestamp, string message);

    // Struct in solidity
    struct Wave {
        address waver;
        uint256 timestamp;
        string message;
    }

    Wave[] waves;

    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */

    mapping(address => uint256) public lastWaved;

    constructor() payable {
        console.log("See you! Space Cowboy");

        // Setting initial seed for randomization.

        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _msg) public {
        // Checking for the 15 miinute condition.
        require(
            lastWaved[msg.sender] + 30 seconds < block.timestamp,
            "You can't wave too often!"
        );

        // Setting last waved time for this user.
        lastWaved[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender, _msg);

        waves.push(Wave(msg.sender, block.timestamp, _msg));

        // Seed for the next user

        seed = (block.timestamp + block.difficulty + seed) % 100;

        console.log("Random generated seed", seed);

        if (seed <= 50) {
            console.log("%s won", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Contract doesn't have enough balance"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _msg);

        uint256 prizeAmount = 0.00001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has!!"
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Total Waves %d", totalWaves);
        return totalWaves;
    }
}
