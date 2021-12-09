import { expect } from './setup'
import { ethers } from 'hardhat'
import { Contract, Signer, BigNumber, utils } from 'ethers'



describe('Editions', () => {
    let deployer: Signer
    let primaryRecipient: Signer
    let platform: Signer
    let buyer: Signer
    let royalty: Signer



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

    const BASIS_POINTS = 10000



    beforeEach(async () => {
        [deployer, buyer, primaryRecipient, platform, royalty] = await ethers.getSigners()

        const hyperlinkFactory = await ethers.getContractFactory("HyperlinkFactory");
        HyperlinkFactory = await hyperlinkFactory.deploy();
        await HyperlinkFactory.deployed();

        const hyperlinkAddress = await HyperlinkFactory.predictEditionAddress(TOKEN_METADATA)


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

    describe('Name & Symbol', () => {
        it('should have expected name', async () => {
            expect(await Hyperlink.name()).to.equal(HYPERLINK_NAME)
        })
        it('should have expected symbol', async () => {
            expect(await Hyperlink.symbol()).to.equal(HYPERLINK_SYMBOL)
        })
    })

    describe('URIs', () => {
        it('should have expected contract URI', async () => {
            expect(await Hyperlink.contractURI()).to.equal(CONTRACT_METADATA)
        })
        it('should have expected edition URI', async () => {
            await Hyperlink.connect(buyer).mint({value: SALE_PRICE})
            expect(await Hyperlink.tokenURI(1)).to.equal(TOKEN_METADATA)

        })
    })

    describe('Base Getter Functions', () => {
        it('should have expected token metdata', async () => {
            expect(await Hyperlink.tokenMetadata()).to.equal(TOKEN_METADATA)
        })

        it('should have expected number sold', async () => {
            expect(await Hyperlink.numberSold()).to.equal(0)
        })

        it('should have expected sale price', async () => {
            expect(await Hyperlink.salePrice()).to.equal(SALE_PRICE)
        })


        it('should have expected quantity for sale', async () => {
            expect(await Hyperlink.quantityForSale()).to.equal(QUANTITY_FOR_SALE)
        })

        it('should have expected quantity for sale', async () => {
            expect(await Hyperlink.link()).to.equal(NO_HYPERLINK)
        })
    })



    describe('Buying Testing', () => {
        it('normal minting', async () => {
            await Hyperlink.connect(buyer).mint({value: SALE_PRICE})
            expect(await Hyperlink.ownerOf(BigNumber.from("1"))).to.equal(await buyer.getAddress())
            expect(await Hyperlink.balanceOf(await buyer.getAddress())).to.equal(1)
        })

        it('wrong value should fail', async () => {
            await expect(
                Hyperlink.connect(buyer).mint({value: SALE_PRICE.add(1000)})
            ).to.be.revertedWith("Hyperlink: must send enough to purchase the edition");
        })
        it("sold out minting should fail", async () => {

            const OTHER_TOKEN_METADATA = "ar://yo"
            const otherHyperlinkAddress = await HyperlinkFactory.predictEditionAddress(OTHER_TOKEN_METADATA)
            const hyperlink = await ethers.getContractFactory("Hyperlink");
    
    
            await HyperlinkFactory.createHyperlink(
                OTHER_TOKEN_METADATA,
                CONTRACT_METADATA,
                await primaryRecipient.getAddress(),
                1,
                SALE_PRICE,
                await platform.getAddress(),
                PLATFORM_FEE_BASIS_POINTS,
                NO_HYPERLINK
            )
    
            const otherHyperlink = await hyperlink.attach(otherHyperlinkAddress);

            otherHyperlink.connect(buyer).mint({value: SALE_PRICE})


            
            await expect(
                otherHyperlink.connect(buyer).mint({value: SALE_PRICE})
            ).to.be.revertedWith("Hyperlink: all editions have already been sold");
        })
    })


    describe('Hyperlink Testing', () => {
        it('not having the correct erc721 should fail', async () => {
            const OTHER_TOKEN_METADATA = "ar://yo"
            const otherHyperlinkAddress = await HyperlinkFactory.predictEditionAddress(OTHER_TOKEN_METADATA)
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


            await expect(
                otherHyperlink.connect(buyer).mint({value: SALE_PRICE})
            ).to.be.revertedWith("Hyperlink: must own the linked edition to mint");



            await Hyperlink.connect(buyer).mint({value: SALE_PRICE})

            await otherHyperlink.connect(buyer).mint({value: SALE_PRICE})

        })

        it('having the correct erc721 should succeed', async () => {
            const OTHER_TOKEN_METADATA = "ar://yo"
            const otherHyperlinkAddress = await HyperlinkFactory.predictEditionAddress(OTHER_TOKEN_METADATA)
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

        })
    })

    describe('Royalty Testing', () => {
        it('should have expected treasury', async () => {

            const platformBalanceBefore = await platform.getBalance()
            const primaryRecipientBalanceBefore = await primaryRecipient.getBalance()

            const royaltyValue = ethers.utils.parseEther("1.0")


            let tx = {
                to: Hyperlink.address,
                value: royaltyValue
            }

            await royalty.sendTransaction(tx)

            await Hyperlink.withdraw()

            const platformBalanceAfter = await platform.getBalance()
            const primaryRecipientBalanceAfter = await primaryRecipient.getBalance()

            expect(platformBalanceBefore.add(royaltyValue.mul(PLATFORM_FEE_BASIS_POINTS).div(BASIS_POINTS))).to.equal(platformBalanceAfter)
            expect(primaryRecipientBalanceBefore.add(royaltyValue.mul(BASIS_POINTS - PLATFORM_FEE_BASIS_POINTS).div(BASIS_POINTS))).to.equal(primaryRecipientBalanceAfter)


        })

    })


    describe('Creating Collection', () => {
        it('creating with excessive basis points should fail', async () => {
            const OTHER_TOKEN_METADATA = "ar://yo"

            await expect(
                HyperlinkFactory.createHyperlink(
                    OTHER_TOKEN_METADATA,
                    CONTRACT_METADATA,
                    await primaryRecipient.getAddress(),
                    QUANTITY_FOR_SALE,
                    SALE_PRICE,
                    await platform.getAddress(),
                    100001, // more than is allowed
                    Hyperlink.address
                )
            ).to.be.revertedWith("HyperlinkFactory: platform fee basis points must be less than or equal to contract basis points");

        })

        it('creating with quantity zero should fail', async () => {
            const OTHER_TOKEN_METADATA = "ar://yo"

            await expect(
                HyperlinkFactory.createHyperlink(
                    OTHER_TOKEN_METADATA,
                    CONTRACT_METADATA,
                    await primaryRecipient.getAddress(),
                    0,
                    SALE_PRICE,
                    await platform.getAddress(),
                    PLATFORM_FEE_BASIS_POINTS, // more than is allowed
                    Hyperlink.address
                )
            ).to.be.revertedWith("HyperlinkFactory: must sell at least one edition");

        })


        it('creating with quantity zero should fail', async () => {

            const NON_ERC721 = "0x0000000000000000000000000000000000000001"

            const OTHER_TOKEN_METADATA = "ar://yo"

            await expect(
                HyperlinkFactory.createHyperlink(
                    OTHER_TOKEN_METADATA,
                    CONTRACT_METADATA,
                    await primaryRecipient.getAddress(),
                    QUANTITY_FOR_SALE,
                    SALE_PRICE,
                    await platform.getAddress(),
                    PLATFORM_FEE_BASIS_POINTS, // more than is allowed
                    NON_ERC721
                )
            ).to.be.revertedWith("Transaction reverted: function call to a non-contract account");

        })

    })







})