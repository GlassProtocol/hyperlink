import { ethers } from "hardhat";
import { utils } from 'ethers'

const HYPERLINK_ADDRESS = '0x929378707faFE67337A5b4762fE861E55726DeCf'
const SALE_PRICE = utils.parseEther("0.10")

const REFERRAL = "0x0000000000000000000000000000000000000000"



async function main() {
    const contractFactory = await ethers.getContractFactory("Hyperlink");
    const hyperlink = contractFactory.attach(HYPERLINK_ADDRESS);
    await hyperlink.buyEdition(REFERRAL, {value: SALE_PRICE})
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });