import { ethers } from "hardhat";
import { utils } from 'ethers'

const EDITION_ADDRESS = '0x929378707faFE67337A5b4762fE861E55726DeCf'
const TOKEN_ID = 0


async function main() {
    const contractFactory = await ethers.getContractFactory("Editions");
    const edition = contractFactory.attach(EDITION_ADDRESS);
    console.log(await edition.name())
    console.log(await edition.symbol())

    console.log(await edition.tokenURI(TOKEN_ID))
    console.log(await edition.contractURI())
    console.log(await edition.editionURI())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });