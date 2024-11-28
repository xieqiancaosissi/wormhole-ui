import {
  ChainId,
  ChainName,
  coalesceChainId,
  CONTRACTS,
  coalesceChainName,
  getGovernorIsVAAEnqueued,
  getSignedVAA,
} from "@certusone/wormhole-sdk";
import { viewFunction } from "@/utils/near";
import { GetSignedVAAWithRetryResult } from "@/interfaces/bridge";
export const WORMHOLE_RPC_HOSTS = [
  "https://api.wormholescan.io", // Explorer offers a guardian equivalent endpoint for fetching VAAs
  "https://wormhole-v2-mainnet-api.mcf.rocks",
  "https://wormhole-v2-mainnet-api.chainlayer.network",
  "https://wormhole-v2-mainnet-api.staking.fund",
];
export const getTokenBridgeAddressForChain = (chainId: ChainId) => {
  const env = "MAINNET";
  const CONTRACTS_MAP = CONTRACTS[env];
  const contracts = CONTRACTS_MAP[coalesceChainName(chainId)];
  return contracts?.token_bridge || "";
};

export const getBridgeAddressForChain = (chainId: ChainId) => {
  const env = "MAINNET";
  const CONTRACTS_MAP = CONTRACTS[env];
  const contracts = CONTRACTS_MAP[coalesceChainName(chainId)];
  return contracts?.core || "";
};
export const getSignedVAAWithRetry = async (
  emitterChain: ChainId | ChainName,
  emitterAddress: string,
  sequence: string,
  retryAttempts?: number
): Promise<GetSignedVAAWithRetryResult> => {
  let currentWormholeRpcHost = -1;
  const getNextRpcHost = () =>
    ++currentWormholeRpcHost % WORMHOLE_RPC_HOSTS.length;
  let attempts = 0;
  while (true) {
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const rpcHost = WORMHOLE_RPC_HOSTS[getNextRpcHost()];
    const results = await Promise.allSettled([
      getSignedVAA(rpcHost, emitterChain, emitterAddress, sequence),
      getGovernorIsVAAEnqueued(rpcHost, emitterChain, emitterAddress, sequence),
    ]);
    if (results[0].status === "fulfilled") {
      return { vaaBytes: results[0].value.vaaBytes, isPending: false };
    }
    if (results[1].status === "fulfilled" && results[1].value.isEnqueued) {
      return { vaaBytes: undefined, isPending: true };
    }
    if (retryAttempts !== undefined && attempts > retryAttempts) {
      throw new Error(results[0].reason);
    }
  }
};
export async function getForeignAssetNear(
  tokenAccount: string,
  chain: ChainId | ChainName,
  contract: string
): Promise<string | null> {
  const chainId = coalesceChainId(chain);

  const ret = await viewFunction({
    contractId: tokenAccount,
    methodName: "get_foreign_asset",
    args: {
      chain: chainId,
      address: contract,
    },
  });
  if (ret === "") return null;
  else return ret;
}
