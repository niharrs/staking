// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "./utils/SafeMath.sol";
import "./hyperverse/IHyperverseModule.sol";
import "./hyperverse/Initializable.sol";

import "./ExampleExternalContract.sol";
import "hardhat/console.sol";

contract Staker is IHyperverseModule, Initializable {
    using SafeMath for uint256;

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    // Account used to deploy contract
    address public immutable contractOwner;

    //stores the tenant owner
    address private _tenantOwner;

    ///+state
    ExampleExternalContract public exampleExternalContract;

    uint256 public constant threshold = 2 wei;

    uint256 public deadline = block.timestamp + 200 seconds;

    mapping(address => uint256) public balances;

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E V E N T S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    ///+events
    event Stake(address indexed sender, uint256 amount);

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    error Unauthorized();
    error AlreadyInitialized();
    error ZeroAddress();
    error SameAddress();

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    ///+modifiers
    modifier isTenantOwner() {
        if (msg.sender != _tenantOwner) {
            revert Unauthorized();
        }
        _;
    }

    modifier canInitialize(address _tenant) {
        if (_tenantOwner != address(0)) {
            revert AlreadyInitialized();
        }
        _;
    }

    modifier addressCheck(address _from, address _to) {
        if (_from == _to) {
            revert SameAddress();
        }
        if (_to == address(0) || _from == address(0)) {
            revert ZeroAddress();
        }
        _;
    }

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    /**
     * @dev Make sure to update the information in the metadata before you deploy
     */
    constructor(address _owner, address exampleExternalContractAddress) public {
        metadata = ModuleMetadata(
            "Staker",
            _owner,
            "0.0.1",
            block.timestamp,
            "https://www.hyperverse.dev"
        );
        contractOwner = _owner;
        exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
    }

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ F U N C T I O N S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    /**
     * @dev Initializes the instance of a tenant for this contract and sets the state variables
     *
     * @param _tenant The address of the instance owner
     */
    function initialize(address _tenant)
        external
        initializer
        canInitialize(_tenant)
    {
        _tenantOwner = _tenant;
    }

    ///+functions
    function stake() public payable {
        // update the user's balance
        balances[msg.sender] += msg.value;
        
        // emit the event to notify the blockchain that we have correctly Staked some fund for the user
        emit Stake(msg.sender, msg.value);
    }

    // After some `deadline` allow anyone to call an `execute()` function
    //  It should either call `exampleExternalContract.complete{value: address(this).balance}()` to send all the value
    //function execute() public stakeNotCompleted deadlineReached(false) {
    function execute() public {

        require(timeLeft() == 0, "Deadline not yet expired");

        uint256 contractBalance = address(this).balance;

        // check the contract has enough ETH to reach the threshold
        require(contractBalance >= threshold, "Threshold is not reached");

        // Execute the external contract, transfer all the balance to the contract
        // (bool sent, bytes memory data) = exampleExternalContract.complete{value: contractBalance}();
        (bool sent,) = address(exampleExternalContract).call{value: contractBalance}(abi.encodeWithSignature("complete()"));
        require(sent, "exampleExternalContract.complete failed :(");
    }

    // if the `threshold` was not met, allow everyone to call a `withdraw()` function


  // Add a `withdraw(address payable)` function lets users withdraw their balance
  // function withdraw() public deadlineReached(true) stakeNotCompleted {
  function withdraw(address payable depositor) public {
    uint256 userBalance = balances[depositor];

    // only allow withdrawals if the deadline has expired
    require(timeLeft() == 0, "Deadline not yet expired");

    // check if the user has balance to withdraw
    require(userBalance > 0, "No balance to withdraw");

    // reset the balance of the user.
    // Do this before transferring balance to prevent re-entrancy attacks.
    balances[depositor] = 0;

    // Transfer balance back to the user
    (bool sent,) = depositor.call{value: userBalance}("");
    require(sent, "Failed to send user balance back to the user");
  }

  // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
  function timeLeft() public view returns (uint256 timeleft) {
    console.log("Time: ", block.timestamp);
    if (deadline >= block.timestamp) {
        return deadline - block.timestamp;
    } else {
        return 0;
    }
  }

  // Add the `receive()` special function that receives eth and calls stake()
  function receive() public {
    stake();
  }
}
