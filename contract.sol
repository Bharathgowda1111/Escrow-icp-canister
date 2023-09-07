// contracts/Escrow.sol
pragma solidity ^0.8.0;

contract Escrow {
    address public buyer;
    address public seller;
    address public arbiter;
    uint256 public amount;
    bool public released;
    bool public fundLocked;

    constructor(address _seller, address _arbiter) {
        buyer = msg.sender;
        seller = _seller;
        arbiter = _arbiter;
    }

    function deposit() public payable {
        require(msg.sender == buyer && !fundLocked, "Only the buyer can deposit funds");
        amount += msg.value;
    }

    function release() public {
        require(msg.sender == arbiter && !released && fundLocked, "Only the arbiter can release funds");
        seller.transfer(amount);
        released = true;
    }

    function refund() public {
        require(msg.sender == arbiter && !released && fundLocked, "Only the arbiter can refund funds");
        buyer.transfer(amount);
        released = true;
    }

    function lockFunds() public {
        require(msg.sender == seller, "Only the seller can lock funds");
        fundLocked = true;
    }
}
