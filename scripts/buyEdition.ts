import { ethers } from "hardhat";
import { utils } from 'ethers'

const EDITION_ADDRESS = '0x929378707faFE67337A5b4762fE861E55726DeCf'
const PRICE = utils.parseEther('0.01')


async function main() {
    const contractFactory = await ethers.getContractFactory("Editions");
    const edition = contractFactory.attach(EDITION_ADDRESS);
    await edition.buyEdition({value: PRICE})
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });