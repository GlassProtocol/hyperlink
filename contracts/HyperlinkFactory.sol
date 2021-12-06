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

    function createEdition(
        string calldata _tokenMetadata,
        string calldata _contractMetadata,
        address payable _primaryRecipient,
        uint256 _quantityForSale,
        uint256 _salePrice,
        address payable _platform,
        uint256 _platformFeeBasisPoints,
        address _hyperlink
    ) external returns (address) {
        address clone = ClonesUpgradeable.cloneDeterministic(implementation, keccak256(abi.encode(_tokenMetadata)));

        require(_platformFeeBasisPoints <= BASIS_POINTS, "HyperlinkFactory: platform fee basis points must be less than or equal to contract basis points");

        require(_quantityForSale > 0, "HyperlinkFactory: must sell at least one edition");

        if (_hyperlink != address(0)) {
            require(
                IERC165Upgradeable(_hyperlink).supportsInterface(type(IERC721Upgradeable).interfaceId),
                "HyperlinkFactory: hyperlink does not support ERC721 interfaceID"
            );
        }

        Hyperlink(payable(clone)).initialize( _tokenMetadata, _contractMetadata, _primaryRecipient, _quantityForSale, _salePrice, _platform, _platformFeeBasisPoints, _hyperlink);
        emit HyperlinkCreated(_primaryRecipient, _hyperlink, _platform, clone, _quantityForSale, _salePrice, _platformFeeBasisPoints);
        return clone;
    }

    function predictEditionAddress(string calldata _tokenMetadata) public view returns (address) {
        return ClonesUpgradeable.predictDeterministicAddress(implementation, keccak256(abi.encode(_tokenMetadata)));
    }
}