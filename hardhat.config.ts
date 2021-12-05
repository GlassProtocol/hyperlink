import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-solhint'
import '@typechain/hardhat'
import "@nomiclabs/hardhat-etherscan";


dotenv.config();


const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  typechain: {
    outDir: 'bindings',
    target: 'ethers-v5'
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.RINKEBY_ALCHEMY_KEY}`,
      accounts: [process.env.TESTING_PRIVATE_KEY!],
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.MAINNET_ALCHEMY_KEY}`,
      accounts: [process.env.PRODUCTION_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  }
};


export default config