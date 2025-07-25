// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessContract {
    struct Resource {
        address owner;
        string cid;
        uint256 price;
        uint256 duration;
        bool isActive;
    }

    struct Access {
        uint256 expiresAt;
        uint256 amountPaid;
    }

    uint256 public nextResourceId;

    mapping(uint256 => Resource) public resources;
    mapping(address => mapping(uint256 => Access)) public accessMap;
    mapping(address => uint256) public sellerBalances;

    uint256[] public resourceIds; // tracks resourceId list

    event ResourceCreated(uint256 resourceId, address indexed owner, string cid, uint256 price, uint256 duration);
    event AccessPurchased(uint256 resourceId, address indexed buyer, uint256 expiresAt);
    event Withdrawal(address indexed seller, uint256 amount);

    // Anyone can list a resource
    function createResource(string calldata cid, uint256 price, uint256 duration) external {
        resources[nextResourceId] = Resource({
            owner: msg.sender,
            cid: cid,
            price: price,
            duration: duration,
            isActive: true
        });

        resourceIds.push(nextResourceId);

        emit ResourceCreated(nextResourceId, msg.sender, cid, price, duration);
        nextResourceId++;
    }

    // Buyer pays for access
    function buyAccess(uint256 resourceId) external payable {
        Resource memory res = resources[resourceId];
        require(res.isActive, "Resource not active");
        require(msg.value == res.price, "Incorrect payment");

        accessMap[msg.sender][resourceId] = Access({
            expiresAt: block.timestamp + res.duration,
            amountPaid: msg.value
        });

        // Track seller earnings
        sellerBalances[res.owner] += msg.value;

        emit AccessPurchased(resourceId, msg.sender, block.timestamp + res.duration);
    }

    // View-only check if a user has access
    function hasAccess(address user, uint256 resourceId) external view returns (bool) {
        return block.timestamp < accessMap[user][resourceId].expiresAt;
    }

    // Seller can withdraw their total earnings
    function withdraw() external {
        uint256 amount = sellerBalances[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        sellerBalances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    // Deactivate resource (soft delete)
    function deactivateResource(uint256 resourceId) external {
        require(msg.sender == resources[resourceId].owner, "Not owner");
        resources[resourceId].isActive = false;
    }

    // Get all resource listings (for frontend display)
    function getAllResources() external view returns (Resource[] memory) {
        uint256 count = resourceIds.length;
        Resource[] memory all = new Resource[](count);
        for (uint256 i = 0; i < count; i++) {
            all[i] = resources[resourceIds[i]];
        }
        return all;
    }

    // Optional helper for frontend: get resourceId list
    function getAllResourceIds() external view returns (uint256[] memory) {
        return resourceIds;
    }
}
