// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// for mock purposes only, no limit on minting functionality
contract ExampleNFT is NonblockingLzApp, ERC721 {

    constructor(address _lzEndpoint) ERC721("ExampleNFT", "ENFT") NonblockingLzApp(_lzEndpoint) {}

    function mint(address to, uint tokenId) public {
        _safeMint(to, tokenId, "");
    }

    function transfer(address to, uint tokenId) public {
        _safeTransfer(msg.sender, to, tokenId, "");
    }

    function isApprovedOrOwner(address spender, uint tokenId) public view virtual returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {

        // decode the tokenId, oldOwner, newOwner sent thus far
        (uint tokenId, address oldOwner, address newOwner) = abi.decode(_payload, (uint, address, address));

        // update owner of tokenId
        _safeTransfer(oldOwner, newOwner, tokenId, "");
    }

}
