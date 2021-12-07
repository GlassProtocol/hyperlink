// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";




import "./Hyperlink.sol";





contract HyperlinkFactory {

    using SafeMathUpgradeable for uint256;

    uint256 internal constant BASIS_POINTS = 10000; // denominator for calculating percentages



    event HyperlinkCreated(
        address indexed primaryRecipient,
        address indexed hyperlink,
        address indexed platform,
        address contractAddress,
        uint256 quantityForSale,
        uint256 salePrice,
        uint256 platformFeeBasisPoints
    );

    address immutable internal implementation;

    constructor() {
        implementation = address(new Hyperlink());
    }
    
    function getImplementation() public view returns (address) {
        return implementation;
    }

    function createHyperlink(
        string calldata tokenMetadata_,
        string calldata contractMetadata_,
        address payable primaryRecipient_,
        uint256 quantityForSale_,
        uint256 salePrice_,
        address payable platform_,
        uint256 platformFeeBasisPoints_,
        address link_
    ) external returns (address) {
        address clone = ClonesUpgradeable.cloneDeterministic(implementation, keccak256(abi.encode(tokenMetadata_)));

        require(platformFeeBasisPoints_ <= BASIS_POINTS, "HyperlinkFactory: platform fee basis points must be less than or equal to contract basis points");

        require(quantityForSale_ > 0, "HyperlinkFactory: must sell at least one edition");

        if (link_ != address(0)) {
            require(
                IERC165Upgradeable(link_).supportsInterface(type(IERC721Upgradeable).interfaceId),
                "HyperlinkFactory: hyperlink does not support ERC721 interfaceID"
            );
        }

        Hyperlink(payable(clone)).initialize( tokenMetadata_, contractMetadata_, primaryRecipient_, quantityForSale_, salePrice_, platform_, platformFeeBasisPoints_, link_);
        emit HyperlinkCreated(primaryRecipient_, link_, platform_, clone, quantityForSale_, salePrice_, platformFeeBasisPoints_);
        return clone;
    }

    function predictEditionAddress(string calldata _tokenMetadata) public view returns (address) {
        return ClonesUpgradeable.predictDeterministicAddress(implementation, keccak256(abi.encode(_tokenMetadata)));
    }
}