// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";




import "./Hyperlink.sol";





contract HyperlinkFactory {

    using SafeMathUpgradeable for uint256;


    event HyperlinkCreated(
        address indexed primaryRecipient,
        address indexed hyperlink,
        address indexed platform,
        address contractAddress,
        uint256 quantityForSale,
        uint256 salePrice,
        uint256 platformFee
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
        uint256 _platformFee,
        address _hyperlink
    ) external returns (address) {
        address clone = ClonesUpgradeable.cloneDeterministic(implementation, keccak256(abi.encode(_tokenMetadata)));

        require(_salePrice.sub(_platformFee) > 0, "");
        require(_quantityForSale > 0, "");

        if (_hyperlink != address(0)) {
            require(
                IERC165Upgradeable(_hyperlink).supportsInterface(type(IERC721Upgradeable).interfaceId),
                "HyperlinkFactory: hyperlink does not support ERC721 interfaceID"
            );
        }

        Hyperlink(payable(clone)).initialize( _tokenMetadata, _contractMetadata, _primaryRecipient, _quantityForSale, _salePrice, _platform, _platformFee, _hyperlink);
        emit HyperlinkCreated(_primaryRecipient, _hyperlink, _platform, clone, _quantityForSale, _salePrice, _platformFee);
        return clone;
    }

    function predictEditionAddress(string calldata _tokenMetadata) public view returns (address) {
        return ClonesUpgradeable.predictDeterministicAddress(implementation, keccak256(abi.encode(_tokenMetadata)));
    }
}