// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Hyperlink.sol";


contract HyperlinkFactory {
    address immutable internal implementation;

    constructor() {
        implementation = address(new Hyperlink());
    }
    
    function getImplementation() public view returns (address) {
        return implementation;
    }

    function createEdition(
        string calldata _tokenMetadata,
        string calldata _contractMetadata,
        address payable _primaryRecipient,
        uint256 _quantityForSale,
        uint256 _salePrice,
        address payable _curator,
        uint256 _curatorFee,
        uint256 _referralFee,
        address _hyperlink
    ) external returns (address) {
        address clone = Clones.cloneDeterministic(implementation, keccak256(abi.encode(_tokenMetadata)));
        Hyperlink(payable(clone)).initialize( _tokenMetadata, _contractMetadata, _primaryRecipient, _quantityForSale, _salePrice, _curator, _curatorFee, _referralFee, _hyperlink);
        return clone;
    }

    function predictEditionAddress(string calldata _tokenMetadata) public view returns (address) {
        return Clones.predictDeterministicAddress(implementation, keccak256(abi.encode(_tokenMetadata)));
    }
}