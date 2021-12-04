import { ethers } from "hardhat";
import { utils } from 'ethers'

const FACTORY_ADDRESS = "0xFFEB90fad48F522190ABb86BDd6ac7169C20Ef00"


const TOKEN_METADATA = "ar://jlPqgRN64nqsqX04uI0z5alJIKudGIGwEPalDsLfG6c"
const CONTRACT_METADATA = "ar://67tSLhzy-ji2Gbfoe6wujBbhkQ3jfFrThUj2Y9d8"
const PRIMARY_RECIPIENT = "0xAbf798E220c6E44E4F8d720E8095E8dB230E9718"
const QUANTITY_FOR_SALE = 100
const SALE_PRICE = utils.parseEther("0.10")
const CURATOR = "0x84361648F858396551beF155F9ED578d807D5Be8"
const REFERRAL_FEE = utils.parseEther("0.01")
const HYPERLINK = "0x0000000000000000000000000000000000000000"

async function main() {
    const contractFactory = await ethers.getContractFactory("HyperlinkFactory");
    const hyperlinkFactory = contractFactory.attach(FACTORY_ADDRESS);
    await hyperlinkFactory.createEdition(
        TOKEN_METADATA,
        CONTRACT_METADATA,
        PRIMARY_RECIPIENT,
        QUANTITY_FOR_SALE,
        SALE_PRICE,
        CURATOR,
        REFERRAL_FEE,
        HYPERLINK
    )
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });