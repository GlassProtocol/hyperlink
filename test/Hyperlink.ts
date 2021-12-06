import { expect } from './setup'
import { ethers } from 'hardhat'
import { Contract, Signer, BigNumber, utils } from 'ethers'



describe('Editions', () => {
    let deployer: Signer
    let primaryRecipient: Signer
    let platform: Signer
    let buyer: Signer


    let HyperlinkFactory: Contract
    let Hyperlink: Contract
    const HYPERLINK_NAME = "Hyperlink"
    const HYPERLINK_SYMBOL = "HYPERLINK"



    const TOKEN_METADATA = "ar://jlPqgRN64nqsqX04uI0z5alJIKudGIGwEPalDsLfG6c"
    const CONTRACT_METADATA = "ar://67tSLhzy-ji2Gbfoe6wujBbhkQ3jfFrThUj2Y9d8"

    const QUANTITY_FOR_SALE = 100
    const SALE_PRICE = utils.parseEther("0.10")

    const PLATFORM_FEE_BASIS_POINTS = 2000
    const NO_HYPERLINK = "0x0000000000000000000000000000000000000000"



    beforeEach(async () => {
        [deployer, buyer, primaryRecipient, platform] = await ethers.getSigners()

        const hyperlinkFactory = await ethers.getContractFactory("HyperlinkFactory");
        HyperlinkFactory = await hyperlinkFactory.deploy();
        await HyperlinkFactory.deployed();

        const hyperlinkAddress = await HyperlinkFactory.predictEditionAddress(TOKEN_METADATA)

        console.log(hyperlinkAddress)


        const hyperlink = await ethers.getContractFactory("Hyperlink");


        await HyperlinkFactory.createHyperlink(
            TOKEN_METADATA,
            CONTRACT_METADATA,
            await primaryRecipient.getAddress(),
            QUANTITY_FOR_SALE,
            SALE_PRICE,
            await platform.getAddress(),
            PLATFORM_FEE_BASIS_POINTS,
            NO_HYPERLINK
        )

        Hyperlink = await hyperlink.attach(hyperlinkAddress);


    })

    describe('Name & Symbol Testing', () => {
        it('should have expected name', async () => {
            expect(await Hyperlink.name()).to.equal(HYPERLINK_NAME)
        })
        it('should have expected symbol', async () => {
            expect(await Hyperlink.symbol()).to.equal(HYPERLINK_SYMBOL)
        })
    })

    describe('URI Testing', () => {
        it('should have expected contract URI', async () => {
            expect(await Hyperlink.contractURI()).to.equal(CONTRACT_METADATA)
        })
        it('should have expected edition URI', async () => {
            expect(await Hyperlink.editionURI()).to.equal(TOKEN_METADATA)
        })
        it('should have expected edition URI', async () => {
            await Hyperlink.connect(buyer).mint({value: SALE_PRICE})
            expect(await Hyperlink.tokenURI(1)).to.equal(TOKEN_METADATA)

        })
    })



    describe('Buying Testing', () => {
        it('should have expected treasury', async () => {


            await Hyperlink.connect(buyer).mint({value: SALE_PRICE})

            console.log(await (await platform.getBalance()).toString())
            console.log(await (await primaryRecipient.getBalance()).toString())
            expect(await Hyperlink.ownerOf(BigNumber.from("1"))).to.equal(await buyer.getAddress())
            expect(await Hyperlink.balanceOf(await buyer.getAddress())).to.equal(1)
        })
    })


    describe('Hyperlink Testing', () => {
        it('should have expected treasury', async () => {


            const OTHER_TOKEN_METADATA = "ar://yo"


            const otherHyperlinkAddress = await HyperlinkFactory.predictEditionAddress(OTHER_TOKEN_METADATA)

            console.log(otherHyperlinkAddress)
    
    
            const hyperlink = await ethers.getContractFactory("Hyperlink");
    
    
            await HyperlinkFactory.createHyperlink(
                OTHER_TOKEN_METADATA,
                CONTRACT_METADATA,
                await primaryRecipient.getAddress(),
                QUANTITY_FOR_SALE,
                SALE_PRICE,
                await platform.getAddress(),
                PLATFORM_FEE_BASIS_POINTS,
                Hyperlink.address
            )
    
            const otherHyperlink = await hyperlink.attach(otherHyperlinkAddress);

            await Hyperlink.connect(buyer).mint({value: SALE_PRICE})

            await otherHyperlink.connect(buyer).mint({value: SALE_PRICE})
            console.log("boought")
            // await otherHyperlink.connect(buyer).mint({value: SALE_PRICE})
            // console.log("should fail")





        })
    })




})