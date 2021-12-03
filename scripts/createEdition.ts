import { ethers } from "hardhat";
import { utils } from 'ethers'

const EDITION_FACTORY_ADDRESS = '0xFFEB90fad48F522190ABb86BDd6ac7169C20Ef00'

const NAME = "TEST EDITION"
const SYMBOL = "SYMB"
const TOKEN_METADATA = "jlPqgRN64nqsqX04uI0z5alJIKudGIGwEPalDsLfG6c"
const CONTRACT_METADATA = "67tSLhzy-ji2Gbfoe6wujBbhkQ3jfFrThUj2Y9d8qao"
const QUANTITY_FOR_SALE = 100
const PRICE = utils.parseEther('0.01')
const FUND_RECIPIENT = '0xAbf798E220c6E44E4F8d720E8095E8dB230E9718'

async function main() {
    const contractFactory = await ethers.getContractFactory("EditionsFactory");
    const editionsFactory = contractFactory.attach(EDITION_FACTORY_ADDRESS);
    await editionsFactory.createEdition(
        NAME,
        SYMBOL,
        utils.base64.decode(TOKEN_METADATA),
        utils.base64.decode(CONTRACT_METADATA),
        QUANTITY_FOR_SALE,
        PRICE,
        FUND_RECIPIENT,
    )
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });