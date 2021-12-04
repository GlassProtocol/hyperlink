import { ethers } from "hardhat";

async function main() {
    const contractFactory = await ethers.getContractFactory("HyperlinkFactory");
    const hyperlinkFactory = await contractFactory.deploy();
    await hyperlinkFactory.deployed();
    console.log(hyperlinkFactory.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });