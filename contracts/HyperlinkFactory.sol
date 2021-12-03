// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Hyperlink.sol";


contract HyperlinkFactory {
    address immutable internal implementation;
    address payable immutable internal curator;
    uint256 immutable internal curatorBasisPoints;

    constructor(address payable _curator, uint256 _curatorBasisPoints) {
        require(_curatorBasisPoints < 10000, "Editions: treasury primary sale fee must be less than 10000 (basis points)");
        implementation = address(new Hyperlink());
        curator = _curator;
        curatorBasisPoints = _curatorBasisPoints;
    }
    
    function getImplementation() public view returns (address) {
        return implementation;
    }

    function createEdition(
        string calldata _name,
        string calldata _symbol,
        string calldata _tokenMetadata,
        string calldata _contractMetadata,
        uint256 _quantityForSale,
        uint256 _price,
        address payable _recipient
    ) external returns (address) {
        address clone = Clones.cloneDeterministic(implementation, keccak256(abi.encode(_tokenMetadata)));
        Hyperlink(payable(clone)).initialize(_name, _symbol, _tokenMetadata, _contractMetadata, _quantityForSale, _price, _recipient, curator, curatorBasisPoints);
        return clone;
    }

    function predictEditionAddress(string calldata _tokenMetadata) public view returns (address) {
        return Clones.predictDeterministicAddress(implementation, keccak256(abi.encode(_tokenMetadata)));
    }
}