import { ethers } from "hardhat";
// import { Signer } from 'ethers'

const TREASURY = '0x2A4e4AB5E6680B76E00Ad4555E39D2DcCA42A659'
const TREASURY_FEE_BASIS_POINTS = 2000


async function main() {
    const contractFactory = await ethers.getContractFactory("EditionsFactory");
    const editionsFactory = await contractFactory.deploy(TREASURY, TREASURY_FEE_BASIS_POINTS);
    await editionsFactory.deployed();
    console.log(editionsFactory.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });