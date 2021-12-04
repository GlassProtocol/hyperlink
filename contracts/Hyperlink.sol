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

    // ============== VARIABLES ==============

    // METADATA
    string internal tokenMetadata;
    string internal contractMetadata;

    // MONETARY
    address payable internal primaryRecipient;
    uint256 internal quantityForSale;
    uint256 internal salePrice;

    address payable internal curator;
    uint256 internal curatorFee; // IN ETH (not a percentage)
    uint256 internal referralFee; // IN ETH (not a percentage)

    // HYPERLINK
    address internal hyperlink;

    // SALES STATE
    uint256 internal numberSold;



    // ============= INITIALIZER =============
    function initialize(
        string calldata _tokenMetadata,
        string calldata _contractMetadata,
        address payable _primaryRecipient,
        uint256 _quantityForSale,
        uint256 _salePrice,
        address payable _curator,
        uint256 _curatorFee,
        uint256 _referralFee,
        address _hyperlink
    ) initializer external {
        __ERC721_init("Hyperlink", "HYPERLINK");
        tokenMetadata = _tokenMetadata;
        contractMetadata = _contractMetadata;

        primaryRecipient = _primaryRecipient;
        quantityForSale = _quantityForSale;
        salePrice = _salePrice;

        curator = _curator;
        curatorFee = _curatorFee;
        referralFee = _referralFee;


        hyperlink = _hyperlink;
    }

    // ============ CORE FUNCTIONS ============
    function mint(address payable referral) external payable nonReentrant {
        // Check that there are still tokens available to purchase.
        require(
            numberSold < quantityForSale,
            "Hyperlink: all editions have already been sold"
        );
        // Check that the sender is paying the correct amount.
        require(
            msg.value == salePrice,
            "Hyperlink: must send enough to purchase the edition"
        );

        require(
            IERC721Upgradeable(address(this)).balanceOf(msg.sender) < 1,
            "Hyperlink: there is a balance limit of one edition per address"
        );

        if (hyperlink != address(0)) {
            require(
                IERC721Upgradeable(hyperlink).balanceOf(msg.sender) > 0,
                "Hyperlink: must own the linked edition to mint"
            );
        }

        require(
            msg.sender != referral,
            "Hyperlink: cannot refer to the same address buying the edition"
        );


        numberSold++; // first edition starts at index 1 (more humanly understood)
        _mint(msg.sender, numberSold);

        curator.sendValue(curatorFee);

        if (referral != address(0) && referralFee != 0) {
            referral.sendValue(referralFee);
            primaryRecipient.sendValue(msg.value.sub(curatorFee).sub(referralFee));
        } else {
            primaryRecipient.sendValue(msg.value.sub(curatorFee));
        }
    }

    // ============ URI FUNCTIONS ============

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(ownerOf(_tokenId) != address(0), "Hyperlink: token has not been sold or does not exist");
        return tokenMetadata;
    }

    function contractURI() public view returns (string memory) {
        return contractMetadata;
    }

    function editionURI() public view returns (string memory) {
        return tokenMetadata;
    }

}
