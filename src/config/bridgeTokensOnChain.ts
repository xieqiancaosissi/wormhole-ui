import { ISupportTokensOnChain } from "@/interfaces/bridge";
import { formatFileUrl, formatStaticFileUrl } from "@/utils/format";
export const TOKENS_ON_NEAR: ISupportTokensOnChain[] = [
  {
    address: "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
    name: "Native USDC",
    symbol: "USDC",
    chain: "NEAR",
    channel: ["Stargate"],
    decimals: 6,
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
  {
    address: "3.contract.portalbridge.near",
    name: "Wormhole-wrapped USDC",
    symbol: "USDC.we",
    chain: "NEAR",
    channel: ["Wormhole"],
    decimals: 6,
    icon: formatStaticFileUrl("/portalbridge.svg"),
  },
  {
    address: "16.contract.portalbridge.near",
    name: "Wormhole-wrapped USDC",
    symbol: "USDC.ws",
    chain: "NEAR",
    channel: ["Wormhole"],
    decimals: 6,
    icon: formatStaticFileUrl("/portalbridge_sol.svg"),
  },
  {
    address: "38.contract.portalbridge.near",
    name: "Wormhole-wrapped USDC",
    symbol: "USDC.wb",
    chain: "NEAR",
    channel: ["Wormhole"],
    decimals: 6,
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
  {
    address: "37.contract.portalbridge.near",
    name: "Wormhole-wrapped USDC",
    symbol: "USDC.wa",
    chain: "NEAR",
    channel: ["Wormhole"],
    decimals: 6,
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_ETHEREUM: ISupportTokensOnChain[] = [
  {
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    symbol: "USDC",
    name: "Native USDC",
    chain: "Ethereum",
    decimals: 6,
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_ARBITRUM: ISupportTokensOnChain[] = [
  {
    address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "Arbitrum",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_AURORA: ISupportTokensOnChain[] = [
  {
    address: "0x368EBb46ACa6b8D0787C96B2b20bD3CC3F2c45F7",
    symbol: "USDC",
    name: "Native USDC",
    chain: "Aurora",
    decimals: 6,
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_AVALANCHE: ISupportTokensOnChain[] = [
  {
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    symbol: "USDC",
    name: "Native USDC",
    chain: "Avalanche",
    decimals: 6,
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_BASE: ISupportTokensOnChain[] = [
  {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "Native USDC",
    chain: "Base",
    decimals: 6,
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_MANTLE: ISupportTokensOnChain[] = [
  {
    address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
    symbol: "USDC",
    name: "Native USDC",
    chain: "Mantle",
    decimals: 6,
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_OPTIMISM: ISupportTokensOnChain[] = [
  {
    address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "Optimism",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_POLYGON: ISupportTokensOnChain[] = [
  {
    address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "Polygon",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_SCROLL: ISupportTokensOnChain[] = [
  {
    address: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "Scroll",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_SEI: ISupportTokensOnChain[] = [
  {
    address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "SEI",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_TAIKO: ISupportTokensOnChain[] = [
  {
    address: "0x19e26B0638bf63aa9fa4d14c6baF8D52eBE86C5C",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "TAIKO",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_FLARE: ISupportTokensOnChain[] = [
  {
    address: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "Flare",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_BSC: ISupportTokensOnChain[] = [
  {
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 18,
    chain: "BSC",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
export const TOKENS_ON_GRAVITY: ISupportTokensOnChain[] = [
  {
    address: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
    symbol: "USDC",
    name: "Native USDC",
    decimals: 6,
    chain: "Gravity",
    channel: ["Wormhole", "Stargate"],
    icon: formatFileUrl("/crypto/usdc.svg"),
  },
];
