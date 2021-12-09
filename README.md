<p align="center">
  <img height=100 src="https://arweave.net/sBogY_roIMJWInS0HIEi86eFGzHUnNxUzyKEdOKPWh0" />
</p>

# HYPERLINK: Linked NFT Editions

```diff
- WARNING: these contracts are unaudited
```


Today, we take it for granted that everything on the internet is connected.

Before the advent of the link, virtually nothing on the internet was connected. Each piece of file was an island.

Today, NFTs are islands. Communities form around a single collections, but a majority of NFTs live in isolation.

Hyperlink is a simple primitive that links NFTs together. The goal being to create a rich interconnected web of NFTs that span creators, content-types, and time.

---

# Core Mechanism
The core mechanism behind hyperlink is simple. To mint a linked NFT, the buyer must own (or borrow) the NFT that it is linked to. Loot is a good example of this. To mint a derivative work, you must own the original.

# 1/n Editions
In the case of hyperlink, we opt for 1/n editions (or the limited print model) for a few reasons:

better liquidity
collective ownership
lower barrier to entry
Liquidity
Editions tend to have better liquidity because they are easier to value. By looking at the distribution of sale prices, we can let the free market decide about the value of an asset.

many data points > one data point

Collective Ownership
Collective ownership is a social foundation in web3. By owning something together, communities form. Take for instance the cult-like communities that form around PFP NFTs.

Lower Barriers
A majority of a fans do not have large sums of crypto to spend on 1/1 NFT auctions. Reducing the barrier to entry opens up a new ways for fans to engage with their favorite creators.

---

# Contracts
Factory Mainnet: `0xe844D8286b3a0be21569d6bb736515Ec13548f05`


Factory Rinkeby: `0xBeFb00D12389c1A57c059B015fB6aBD987C14124`



```typescript
// creating a hyperlinked edition pack
await hyperlinkFactory.create(
    TOKEN_METADATA,
    CONTRACT_METADATA,
    PRIMARY_RECIPIENT,
    QUANTITY_FOR_SALE,
    SALE_PRICE,
    PLATFORM,
    PLATFORM_FEE_BASIS_POINTS,
    HYPERLINK
)
```

---
# Usage 

compiling contracts: `$ yarn compile`  

testing contracts: `$ yarn test`  

deploying factory: `$ yarn script scripts/deployFactory.ts --network <YOUR_NETWORK>`  

---

# Todo:

1. refine the contract events
2. peer-reviews (please add a <FIRST_NAME>.md to the peer-review folder)
