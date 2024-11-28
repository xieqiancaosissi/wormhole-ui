import { formatFileUrl } from "@/utils/format";
const TOKENS: (BridgeModel.BridgeTokenMeta & {
  supportChannels?: BridgeModel.BridgeSupportChannel[];
})[] = [
  {
    symbol: "NEAR",
    decimals: { default: 24 },
    addresses: {
      Ethereum: "0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4",
      Arbitrum: "0xA17df6d37695992770D8e4355174DA31FaEA64e7",
      NEAR: "wrap.near",
    },
    icon: formatFileUrl("/crypto/near.svg"),
  },
  {
    symbol: "USDC",
    decimals: { default: 6, BSC: 18 },
    icon: formatFileUrl("/crypto/usdc.svg"),
    addresses: {
      NEAR: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
      Ethereum: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      Arbitrum: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
      Aurora: "0x368EBb46ACa6b8D0787C96B2b20bD3CC3F2c45F7",
      Avalanche: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      Base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      Mantle: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
      Optimism: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      Polygon: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      Scroll: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
      SEI: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
      TAIKO: "0x19e26B0638bf63aa9fa4d14c6baF8D52eBE86C5C",
      Flare: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
      BSC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      Gravity: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
    },
  },
  {
    symbol: "ETH",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "",
      NEAR: "aurora",
    },
    icon: formatFileUrl("/crypto/eth.svg"),
  },
  {
    symbol: "USDT",
    decimals: { default: 6 },
    icon: formatFileUrl("/crypto/usdt.svg"),
    addresses: {
      NEAR: "usdt.tether-token.near",
      Ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  },
  {
    symbol: "USDT.e",
    decimals: { default: 6 },
    addresses: {
      Ethereum: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      NEAR: "dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near",
    },
    icon: formatFileUrl("/crypto/usdt.e.svg"),
  },
  {
    symbol: "USDC.e",
    decimals: { default: 6 },
    addresses: {
      NEAR: "a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near",
    },
    icon: formatFileUrl("/crypto/usdc.e.svg"),
  },
  {
    symbol: "DAI",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      NEAR: "6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near",
    },
    icon: formatFileUrl("/crypto/DAI.svg"),
  },
  {
    symbol: "WBTC",
    decimals: { default: 8 },
    addresses: {
      Ethereum: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      NEAR: "2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near",
    },
    icon: formatFileUrl("/crypto/wbtc.svg"),
  },
  {
    symbol: "OCT",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "0xf5cfbc74057c610c8ef151a439252680ac68c6dc",
      NEAR: "f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near",
    },
    icon: formatFileUrl("/crypto/OCT.svg"),
  },
  {
    symbol: "WOO",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "0x4691937a7508860f876c9c0a2a617e7d9e945d4b",
      NEAR: "4691937a7508860f876c9c0a2a617e7d9e945d4b.factory.bridge.near",
    },
    icon: formatFileUrl("/crypto/woo.png"),
  },
  {
    symbol: "MATIC",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    },
    icon: formatFileUrl("/crypto/matic.png"),
  },
  {
    symbol: "AVAX",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "0x93567d6B6553bDe2b652FB7F197a229b93813D3f",
    },
    icon: formatFileUrl("/crypto/avax.png"),
  },
  {
    symbol: "MNT",
    decimals: { default: 18 },
    addresses: {
      Ethereum: "0x3c3a81e81dc49A522A592e7622A7E711c06bf354",
    },
    icon: formatFileUrl("/crypto/mnt.png"),
  },
  {
    symbol: "SEI",
    decimals: { default: 18 },
    addresses: {
      SEI: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7",
    },
    icon: formatFileUrl("/crypto/sei.png"),
  },
  {
    symbol: "FLR",
    decimals: { default: 18 },
    addresses: {
      Flare: "0x1d80c49bbbcd1c0911346656b529df9e5c2f783d",
    },
    icon: formatFileUrl("/crypto/flr.png"),
  },
  {
    symbol: "BNB",
    decimals: { default: 18 },
    addresses: {
      BSC: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    icon: formatFileUrl("/crypto/bnb.png"),
  },
  {
    symbol: "G",
    decimals: { default: 18 },
    addresses: {
      Gravity: "0x8A3f5659Af2E8FE59640723cf7289DD486576716",
    },
    icon: formatFileUrl("/crypto/g.png"),
  },
];
export default TOKENS;
