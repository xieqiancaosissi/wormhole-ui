import { EVMConfig } from "@/config/bridge";
import TOKENS from "@/config/bridgeTokens";
import {
  TOKENS_ON_NEAR,
  TOKENS_ON_ARBITRUM,
  TOKENS_ON_AVALANCHE,
  TOKENS_ON_AURORA,
  TOKENS_ON_BASE,
  TOKENS_ON_BSC,
  TOKENS_ON_ETHEREUM,
  TOKENS_ON_FLARE,
  TOKENS_ON_GRAVITY,
  TOKENS_ON_MANTLE,
  TOKENS_ON_OPTIMISM,
  TOKENS_ON_POLYGON,
  TOKENS_ON_SCROLL,
  TOKENS_ON_SEI,
  TOKENS_ON_TAIKO,
} from "@/config/bridgeTokensOnChain";
import BridgeTokenRoutes from "@/config/bridgeRoutes";

const tokens = TOKENS.reduce((acc, token) => {
  acc[token.symbol] = token;
  return acc;
}, {} as Record<string, BridgeModel.BridgeTokenMeta>);

export function getChainMainToken(chain: BridgeModel.BridgeSupportChain) {
  if (chain === "NEAR") return tokens.NEAR;
  const mainTokenSymbol = EVMConfig.chains[chain.toLowerCase()].token;
  return tokens[mainTokenSymbol];
}

export function getTokenMeta(symbol: string) {
  return tokens[symbol];
}

export function getTokenAddress(
  symbol: string,
  chain?: BridgeModel.BridgeSupportChain
) {
  return tokens[symbol]?.addresses[chain || "NEAR"];
}

export function getTokenByAddress(
  address: string,
  chain?: BridgeModel.BridgeSupportChain
) {
  return Object.values(tokens).find((token) =>
    Object.values(token.addresses).some(
      (item) => item?.toLowerCase() === address.toLowerCase()
    )
  );
}

export function getTokenDecimals(
  symbol: string,
  chain?: BridgeModel.BridgeSupportChain
) {
  const tokenMeta = tokens[symbol];
  return (
    Object.entries(tokenMeta?.decimals).find(
      ([c, d]) => c.toLowerCase() === chain.toLowerCase()
    )?.[1] || tokenMeta?.decimals.default
  );
}

export function getTokensByChain(chain: BridgeModel.BridgeSupportChain) {
  if (chain == "NEAR") return TOKENS_ON_NEAR;
  if (chain == "Arbitrum") return TOKENS_ON_ARBITRUM;
  if (chain == "Aurora") return TOKENS_ON_AURORA;
  if (chain == "Avalanche") return TOKENS_ON_AVALANCHE;
  if (chain == "BSC") return TOKENS_ON_BSC;
  if (chain == "Base") return TOKENS_ON_BASE;
  if (chain == "Ethereum") return TOKENS_ON_ETHEREUM;
  if (chain == "Flare") return TOKENS_ON_FLARE;
  if (chain == "Gravity") return TOKENS_ON_GRAVITY;
  if (chain == "Mantle") return TOKENS_ON_MANTLE;
  if (chain == "Optimism") return TOKENS_ON_OPTIMISM;
  if (chain == "Polygon") return TOKENS_ON_POLYGON;
  if (chain == "SEI") return TOKENS_ON_SEI;
  if (chain == "Scroll") return TOKENS_ON_SCROLL;
  if (chain == "TAIKO") return TOKENS_ON_TAIKO;
}

export function getRoutes({
  fromChain,
  toChain,
}: {
  fromChain: BridgeModel.BridgeSupportChain;
  toChain: BridgeModel.BridgeSupportChain;
}) {
  const channels = BridgeTokenRoutes.filter((route) => {
    return route.from == fromChain && route.to == toChain;
  });
  const fromAddresses: string[] = [];
  const toAddresses: string[] = [];
  if (channels.length > 0) {
    channels.forEach((channel) => {
      channel.routes.forEach((route) => {
        fromAddresses.push(route.fromAddress);
        toAddresses.push(route.toAddress);
      });
    });
  }
  return {
    supportChannels: channels,
    supportFromAddresses: fromAddresses,
    supportToAddresses: toAddresses,
  };
}

export function getTokenMetaByAddress({
  chain,
  address,
}: {
  chain?: BridgeModel.BridgeSupportChain;
  address: string;
}) {
  let TOKENS: BridgeModel.IBridgeTokenMeta[] = [];
  if (chain) {
    TOKENS = getTokensByChain(chain);
  } else {
    TOKENS = TOKENS_ON_NEAR.concat(TOKENS_ON_ARBITRUM)
      .concat(TOKENS_ON_AURORA)
      .concat(TOKENS_ON_AVALANCHE)
      .concat(TOKENS_ON_BSC)
      .concat(TOKENS_ON_BASE)
      .concat(TOKENS_ON_ETHEREUM)
      .concat(TOKENS_ON_FLARE)
      .concat(TOKENS_ON_GRAVITY)
      .concat(TOKENS_ON_MANTLE)
      .concat(TOKENS_ON_OPTIMISM)
      .concat(TOKENS_ON_POLYGON)
      .concat(TOKENS_ON_SEI)
      .concat(TOKENS_ON_SCROLL)
      .concat(TOKENS_ON_TAIKO);
  }
  const targetToken = TOKENS.find((token) => token.address == address);
  return targetToken;
}
export function getTokenMetaBySymbol({
  chain,
  symbol,
}: {
  chain: BridgeModel.BridgeSupportChain;
  symbol: string;
}) {
  const TOKENS = getTokensByChain(chain);
  const targetToken = TOKENS.find((token) => token.symbol == symbol);
  return targetToken;
}

export function getCanBridgeTokens({
  fromChain,
  toChain,
  token,
}: {
  fromChain: BridgeModel.BridgeSupportChain;
  toChain: BridgeModel.BridgeSupportChain;
  token: BridgeModel.IBridgeTokenMeta;
}) {
  const { supportChannels } = getRoutes({
    fromChain,
    toChain,
  });
  const canBridgeAddresses: string[] = [];
  supportChannels.forEach((supportChannel) => {
    const route = supportChannel.routes.find((route) => {
      return (
        route.fromAddress == token.address || route.toAddress == token.address
      );
    });
    if (route) {
      if (route.fromAddress !== token.address) {
        canBridgeAddresses.push(route.fromAddress);
      }
      if (route.toAddress !== token.address) {
        canBridgeAddresses.push(route.toAddress);
      }
    }
  });
  const canBridgeTokens = canBridgeAddresses.map((address) => {
    return getTokenMetaByAddress({
      address,
    });
  });
  return canBridgeTokens;
}
