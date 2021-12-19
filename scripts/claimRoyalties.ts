import { ethers } from "hardhat";

const HYPERLINK_ADDRESS = '0xef5fA8578db50B8Df15Cd4E2CFcD3617aeA88c9D'

async function main() {
    const contractFactory = await ethers.getContractFactory("Hyperlink");
    const edition = contractFactory.attach(HYPERLINK_ADDRESS);
    await edition.withdraw();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });