import { ethers } from "hardhat";
import { utils } from 'ethers'


const FACTORY_ADDRESS = '0xFFEB90fad48F522190ABb86BDd6ac7169C20Ef00'
const TOKEN_METADATA = "ar://jlPqgRN64nqsqX04uI0z5alJIKudGIGwEPalDsLfG6c"


async function main() {
    const contractFactory = await ethers.getContractFactory("HyperlinkFactory");
    const hyperlinkFactory = contractFactory.attach(FACTORY_ADDRESS);
    const hyperlinkAddress = await hyperlinkFactory.predictEditionAddress(utils.base64.decode(TOKEN_METADATA))
    console.log(hyperlinkAddress)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });