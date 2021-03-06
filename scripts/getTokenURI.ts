import { ethers } from "hardhat";

const HYPERLINK_ADDRESS = '0x929378707faFE67337A5b4762fE861E55726DeCf'
const TOKEN_ID = 0


async function main() {
    const contractFactory = await ethers.getContractFactory("Hyperlink");
    const edition = contractFactory.attach(HYPERLINK_ADDRESS);
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