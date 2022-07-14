// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;
pragma abicoder v2;

import "./lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/// @title A LayerZero example sending a cross chain message from a source chain to a destination chain to increment a counter
contract RemoteUpdater is NonblockingLzApp, Pausable {

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    // disable remote update
    function enable(bool en) external onlyOwner {
        if (en) {
            _unpause();
        } else {
            _pause();
        }
    }

    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory) internal override {}

    // update owner of NFT
    function updateOwnerOfNFT(uint16 _dstChainId, uint _tokenId, address _newOwner) public payable whenNotPaused {
        // encode the payload with the _tokenId and _newOwner
        bytes memory payload = abi.encode(_tokenId, msg.sender, _newOwner);

        _lzSend(_dstChainId, payload, payable(msg.sender), address(0x0), bytes(""));
    }
}
