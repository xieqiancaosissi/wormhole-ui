import { IBridgeTokenRoutes } from "@/interfaces/bridge";
const BridgeTokenRoutesStargate: IBridgeTokenRoutes[] = [
  {
    from: "NEAR",
    to: "Arbitrum",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Ethereum",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Avalanche",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Base",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Optimism",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Polygon",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Scroll",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "SEI",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "TAIKO",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x19e26B0638bf63aa9fa4d14c6baF8D52eBE86C5C",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0,
  },
  {
    from: "NEAR",
    to: "Flare",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0,
  },
  {
    from: "NEAR",
    to: "BSC",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "NEAR",
    to: "Gravity",
    channel: "Stargate",
    symbols: ["USDC"],
    protocolFeeRatio: 0,
    routes: [
      {
        fromAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        toAddress: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "Arbitrum",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    protocolFeeRatio: 0.0006,
    routes: [
      {
        fromAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "Ethereum",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Avalanche",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Base",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Optimism",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Polygon",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Scroll",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "SEI",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "TAIKO",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x19e26B0638bf63aa9fa4d14c6baF8D52eBE86C5C",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Flare",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "BSC",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  {
    from: "Gravity",
    to: "NEAR",
    channel: "Stargate",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6",
        toAddress:
          "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1",
        symbol: "USDC",
      },
    ],
    protocolFeeRatio: 0.0006,
  },
  // {
  //   from: 'Mantle',
  //   to: 'NEAR',
  //   channel: 'Stargate',
  //   symbols: ['USDC'],
  //   protocolFeeRatio: 0.0006,
  // },
  // {
  //   from: 'Ethereum',
  //   to: 'NEAR',
  //   channel: 'Rainbow',
  //   symbols: ['NEAR', 'ETH', 'USDT.e', 'USDC.e', 'DAI', 'WBTC', 'OCT', 'WOO'],
  // },
  // {
  //   from: 'NEAR',
  //   to: 'Ethereum',
  //   channel: 'Rainbow',
  //   symbols: ['NEAR', 'ETH', 'USDT.e', 'USDC.e', 'DAI', 'WBTC', 'OCT', 'WOO'],
  // },
  // {
  //   from: 'NEAR',
  //   to: 'Mantle',
  //   channel: 'Stargate',
  //   symbols: ['USDC'],
  //   protocolFeeRatio: 0.0006,
  // },
];
const BridgeTokenRoutesWormhole: IBridgeTokenRoutes[] = [
  {
    from: "NEAR",
    to: "Arbitrum",
    channel: "Wormhole",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "37.contract.portalbridge.near",
        toAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "NEAR",
    to: "Ethereum",
    channel: "Wormhole",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "3.contract.portalbridge.near",
        toAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "NEAR",
    to: "BSC",
    channel: "Wormhole",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "38.contract.portalbridge.near",
        toAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "Arbitrum",
    to: "NEAR",
    channel: "Wormhole",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
        toAddress: "37.contract.portalbridge.near",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "Ethereum",
    to: "NEAR",
    channel: "Wormhole",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        toAddress: "3.contract.portalbridge.near",
        symbol: "USDC",
      },
    ],
  },
  {
    from: "BSC",
    to: "NEAR",
    channel: "Wormhole",
    symbols: ["USDC"],
    routes: [
      {
        fromAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        toAddress: "38.contract.portalbridge.near",
        symbol: "USDC",
      },
    ],
  },
  // {
  //   from: "NEAR",
  //   to: "Solana",
  //   channel: "Wormhole",
  //   symbols: ["USDC"],
  //   routes: [
  //     {
  //       fromAddress: "16.contract.portalbridge.near",
  //       toAddress: "",
  //       symbol: "USDC",
  //     },
  //   ],
  // },
  // {
  //   from: "Solana",
  //   to: "NEAR",
  //   channel: "Wormhole",
  //   symbols: ["USDC"],
  //   routes: [
  //     {
  //       fromAddresss: "",
  //       toAddres: "16.contract.portalbridge.near",
  //       symbol: "USDC",
  //     },
  //   ],
  // },
];
const BridgeRoutes = BridgeTokenRoutesStargate.concat(
  BridgeTokenRoutesWormhole
);
export default BridgeRoutes;
