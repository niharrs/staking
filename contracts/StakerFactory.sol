// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "./hyperverse/CloneFactory.sol";
import "./hyperverse/IHyperverseModule.sol";
import "./utils/Counters.sol";
import "./Staker.sol";

/**
 * @dev Clone Factory Implementation for a Hyperverse Smart Module
 */

contract StakerFactory is CloneFactory {
    using Counters for Counters.Counter;

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ S T A T E @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    struct Tenant {
        Staker staker;
        address owner;
    }

    Counters.Counter public tenantCounter;

    mapping(address => Tenant) public tenants;
    mapping(address => bool) public instance;

    address public immutable owner;
    address public immutable masterContract;
    address private hyperverseAdmin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E V E N T S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    event TenantCreated(address _tenant, address _proxy);

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ E R R O R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    error Unauthorized();
    error InstanceAlreadyInitialized();
    error InstanceDoesNotExist();
    error ZeroAddress();

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ M O D I F I E R S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    modifier isAuthorized(address _tenant) {
        if (_tenant == address(0)) {
            revert ZeroAddress();
        }
        if (!(msg.sender == _tenant || msg.sender == hyperverseAdmin)) {
            revert Unauthorized();
        }
        _;
    }

    modifier hasAnInstance(address _tenant) {
        if (instance[_tenant]) {
            revert InstanceAlreadyInitialized();
        }
        _;
    }

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ C O N S T R U C T O R @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    constructor(address _masterContract, address _owner) {
        masterContract = _masterContract;
        owner = _owner;
    }

    /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ F U N C T I O N S @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

    function createInstance(address _tenant)
        external
        isAuthorized(_tenant)
        hasAnInstance(_tenant)
    {
        Staker staker = Staker(createClone(masterContract));

        //initializing tenant state of clone
        staker.initialize(_tenant);

        //set Tenant data
        Tenant storage newTenant = tenants[_tenant];
        newTenant.staker = staker;
        newTenant.owner = _tenant;
        instance[_tenant] = true;
        tenantCounter.increment();

        emit TenantCreated(_tenant, address(staker));
    }

    function getProxy(address _tenant) public view returns (Staker) {
        if (!instance[_tenant]) {
            revert InstanceDoesNotExist();
        }
        return tenants[_tenant].staker;
    }
}
