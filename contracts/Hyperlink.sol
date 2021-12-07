// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";



contract Hyperlink is Initializable, ReentrancyGuardUpgradeable, ERC721Upgradeable {
    // ========= USING DECLARATIONS =========
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address payable;

    uint256 internal constant BASIS_POINTS = 10000; // denominator for calculating percentages


    // ============== VARIABLES ==============

    // METADATA
    string internal _tokenMetadata;
    string internal _contractMetadata;

    // MONETARY
    address payable internal _primaryRecipient;
    uint256 internal _quantityForSale;
    uint256 internal _salePrice;

    address payable internal _platform;
    uint256 internal _platformFeeBasisPoints;

    // LINK
    address internal _link;

    // SALES STATE
    uint256 internal _numberSold;



    // ============= INITIALIZER =============
    function initialize(
        string calldata tokenMetadata_,
        string calldata contractMetadata_,
        address payable primaryRecipient_,
        uint256 quantityForSale_,
        uint256 salePrice_,
        address payable platform_,
        uint256 platformFeeBasisPoints_,
        address link_
    ) initializer external {
        __ERC721_init("Hyperlink", "HYPERLINK");
        _tokenMetadata = tokenMetadata_;
        _contractMetadata = contractMetadata_;

        _primaryRecipient = primaryRecipient_;
        _quantityForSale = quantityForSale_;
        _salePrice = salePrice_;

        _platform = platform_;
        _platformFeeBasisPoints = platformFeeBasisPoints_;

        _link = link_;
    }

    // ============ CORE FUNCTIONS ============
    function mint() public payable {
        // Check that there are still tokens available to purchase.
        require(
            _numberSold < _quantityForSale,
            "Hyperlink: all editions have already been sold"
        );
        // Check that the sender is paying the correct amount.
        require(
            msg.value == _salePrice,
            "Hyperlink: must send enough to purchase the edition"
        );

        if (_link != address(0)) {
            require(
                IERC721Upgradeable(_link).balanceOf(msg.sender) > 0,
                "Hyperlink: must own the linked edition to mint"
            );
        }


        _numberSold++; // first edition starts at index 1 (more humanly understood)
        _mint(msg.sender, _numberSold);
    }

    function withdraw() public nonReentrant {
        uint256 contractBalance = address(this).balance;

        require(
            contractBalance > 0,
            "Hyperlink: contract balance must be greater than zero"
        );

        uint256 platformFee = contractBalance.mul(_platformFeeBasisPoints) / BASIS_POINTS;
        _primaryRecipient.sendValue(contractBalance.sub(platformFee)); // the rest goes to the fund recipient 
        if (platformFee > 0) {
            _platform.sendValue(platformFee);
        }
    }

    

    // ============ URI FUNCTIONS ============

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(ownerOf(_tokenId) != address(0), "Hyperlink: token has not been sold or does not exist");
        return _tokenMetadata;
    }

    function contractURI() public view returns (string memory) {
        return _contractMetadata;
    }



    function tokenMetadata() public view returns (string memory) {
        return _tokenMetadata;
    }

    function numberSold() public view returns (uint256) {
        return _numberSold;
    }

    function salePrice() public view returns (uint256) {
        return _salePrice;
    }

    function quantityForSale() public view returns (uint256) {
        return _quantityForSale;
    }

    function link() public view returns (address) {
        return _link;
    }

    // receive any royalties 

    receive() external payable {}

    fallback() external payable {}

}
