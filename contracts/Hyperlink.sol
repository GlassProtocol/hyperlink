// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.0;

import { ReentrancyGuardUpgradeable } from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol';
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";


contract Hyperlink is Initializable, ERC721Upgradeable {
    // ========= USING DECLARATIONS =========
    using SafeMathUpgradeable for uint256;
    using AddressUpgradeable for address payable;

    // ============== CONSTANTS ==============
    uint256 internal constant BASIS_POINTS = 10000; // denominator for calculating percentages


    // ============== VARIABLES ==============
    string internal tokenMetadata;
    string internal contractMetadata;


    uint256 internal quantityForSale;
    uint256 internal price;
    uint256 internal numberSold;

    address payable internal recipient;
    address payable internal curator;
    uint256 internal curatorBasisPoints; // percent out of the basis points above
    address internal hyperlink;


    // ============= INITIALIZER =============
    function initialize(
        string calldata _name,
        string calldata _symbol,
        string calldata _tokenMetadata,
        string calldata _contractMetadata,
        uint256 _quantityForSale,
        uint256 _price,
        address payable _recipient,
        address payable _curator,
        uint256 _curatorBasisPoints
    ) initializer external {
        require(_curatorBasisPoints < BASIS_POINTS, "Hyperlink: curator fee must be less than 10000 (basis points)");
        __ERC721_init(_name, _symbol);
        tokenMetadata = _tokenMetadata;
        contractMetadata = _contractMetadata;
        quantityForSale = _quantityForSale;
        price = _price;
        recipient = _recipient;
        curator = _curator;
        curatorBasisPoints = _curatorBasisPoints;
    }

    // ============ CORE FUNCTIONS ============
    function mint() external payable {
        // Check that there are still tokens available to purchase.
        require(
            numberSold < quantityForSale,
            "Hyperlink: all editions have already been sold"
        );
        // Check that the sender is paying the correct amount.
        require(
            msg.value == price,
            "Hyperlink: must send enough to purchase the edition"
        );



        _mint(msg.sender, numberSold);
        numberSold++;
        uint256 curatorFee = msg.value.mul(curatorBasisPoints) / BASIS_POINTS;
        curator.sendValue(curatorFee);
        recipient.sendValue(msg.value.sub(curatorFee)); // half goes to the edition fund receipient
    }

    // ============ URI FUNCTIONS ============

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        require(ownerOf(_tokenId) != address(0), "Hyperlink: token has not been sold or does not exist");
        return tokenMetadata;
    }

    function contractURI() public view returns (string memory) {
        return contractMetadata;
    }

}
