import { expect } from './setup'
import { ethers } from 'hardhat'
import { Contract, Signer, BigNumber, utils } from 'ethers'



describe('Editions', () => {
    let deployer: Signer
    let treasury: Signer
    let fundRecipient: Signer
    let buyer: Signer


    let EditionFactory: Contract
    let Edition: Contract

    const TREASURY_FEE_BASIS_POINTS = 2000

    const NAME = "TEST EDITION"
    const SYMBOL = "TEST"
    const TOKEN_METADATA = "jlPqgRN64nqsqX04uI0z5alJIKudGIGwEPalDsLfG6c"
    const CONTRACT_METADATA = "67tSLhzy-ji2Gbfoe6wujBbhkQ3jfFrThUj2Y9d8qao"
    const QUANTITY_FOR_SALE = 2
    const PRICE = utils.parseEther('0.1')

    beforeEach(async () => {
        [deployer, treasury, fundRecipient, buyer] = await ethers.getSigners()

        const editionFactory = await ethers.getContractFactory("EditionsFactory");
        EditionFactory = await editionFactory.deploy(await treasury.getAddress(), TREASURY_FEE_BASIS_POINTS);
        await EditionFactory.deployed();

        const editionCloneAddress = await EditionFactory.predictEditionAddress(utils.base64.decode(TOKEN_METADATA))


        const edition = await ethers.getContractFactory("Editions");
        Edition = await edition.attach(editionCloneAddress);


        await EditionFactory.createEdition(
            NAME,
            SYMBOL,
            utils.base64.decode(TOKEN_METADATA),
            utils.base64.decode(CONTRACT_METADATA),
            QUANTITY_FOR_SALE,
            PRICE,
            await fundRecipient.getAddress(),
        )

    })

    describe('Name & Symbol Testing', () => {
        it('should have expected name', async () => {
            expect(await Edition.name()).to.equal(NAME)
        })
        it('should have expected symbol', async () => {
            expect(await Edition.symbol()).to.equal(SYMBOL)
        })
    })

    describe('URI Testing', () => {
        it('should have expected contract URI', async () => {
            expect(await Edition.contractURI()).to.equal("ar://" + CONTRACT_METADATA)
        })
        it('should have expected edition URI', async () => {
            expect(await Edition.editionURI()).to.equal("ar://" + TOKEN_METADATA)
        })
        it('should have expected edition URI', async () => {
            await Edition.connect(buyer).buyEdition({value: ethers.utils.parseEther("0.1")})
            expect(await Edition.tokenURI(0)).to.equal("ar://" + TOKEN_METADATA)

        })
    })

    describe('Treasury Testing', () => {
        it('should have expected treasury', async () => {
            expect(await Edition.getTreasury()).to.equal(await treasury.getAddress())
        })
    })

    describe('Buy Testing', () => {
        it('should have expected treasury', async () => {
            console.log(await (await treasury.getBalance()).toString())
            console.log(await (await fundRecipient.getBalance()).toString())

            await Edition.connect(buyer).buyEdition({value: ethers.utils.parseEther("0.1")})
            console.log(await (await treasury.getBalance()).toString())
            console.log(await (await fundRecipient.getBalance()).toString())
            expect(await Edition.ownerOf(BigNumber.from("0"))).to.equal(await buyer.getAddress())
            expect(await Edition.balanceOf(await buyer.getAddress())).to.equal(1)
        })
    })





})