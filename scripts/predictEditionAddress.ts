import { ethers } from "hardhat";
import { utils } from 'ethers'


const EDITION_FACTORY_ADDRESS = '0xFFEB90fad48F522190ABb86BDd6ac7169C20Ef00'
const TOKEN_METADATA = "jlPqgRN64nqsqX04uI0z5alJIKudGIGwEPalDsLfG6c"


async function main() {
    const contractFactory = await ethers.getContractFactory("EditionsFactory");
    const editionsFactory = contractFactory.attach(EDITION_FACTORY_ADDRESS);
    const editionAddress = await editionsFactory.predictEditionAddress(utils.base64.decode(TOKEN_METADATA))
    console.log(editionAddress)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });