declare namespace BridgeModel {
  type BridgeSupportChain =
    | "Ethereum"
    | "Arbitrum"
    | "NEAR"
    | "Aurora"
    | "Avalanche"
    | "Base"
    | "Mantle"
    | "Optimism"
    | "Polygon"
    | "Scroll"
    | "SEI"
    | "TAIKO"
    | "Flare"
    | "BSC"
    | "Gravity"
    | "Solana";
  type BridgeSupportChannel = "Rainbow" | "Stargate" | "Wormhole";
  type BridgeTokenMeta = {
    symbol: string;
    name?: string;
    decimals: {
      [k in BridgeSupportChain | "default"]?: number;
    };
    icon: string;
    addresses: {
      [k in BridgeSupportChain]?: string;
    };
  };
  type BridgeTransferFormData = {
    from: BridgeTransfer;
    to: BridgeTransfer & {
      isCustomAccountAddress?: boolean;
      customAccountAddress?: string;
    };
  };
  type BridgeTransfer = {
    chain: BridgeSupportChain;
    tokenMeta?: IBridgeTokenMeta;
    amount?: string;
    balance?: string;
  };
  type BridgeTransaction = import("@near-eth/client").DecoratedTransfer & {
    amount?: string;
    decimals?: number;
    startTime: string;
    sourceNetwork: Lowercase<BridgeSupportChain>;
    symbol?: string;
    lockHashes?: string[];
    unlockHashes?: string[];
    burnHashes?: string[];
    mintHashes?: string[];
  };
  type BridgeHistory = {
    account: string;
    chain: BridgeSupportChain;
    type: BridgeSupportChannel;
    from: string;
    to: string;
    from_chain: BridgeSupportChain;
    from_chain_hash: string;
    from_chain_pending: boolean;
    to_chain: BridgeSupportChain;
    to_chain_hash: string;
    to_chain_pending: boolean;
    fee_token: string;
    fee: string;
    token: string;
    volume: string;
    status: "DELIVERED";
    created_time: number;
    update_time: number;
    protocolFeeRatio: number;
    amount: string;
    to_usdc: string;
    to_near: string;
  };
  type BridgeMode = 1 | 2 | 3;
  type IBridgeTokenMeta = {
    address: string;
    symbol: string;
    decimals: number;
    channel: BridgeModel.BridgeSupportChannel[];
    name?: string;
    icon?: string;
  };
  type IWormholeStatus = "unDone" | "going" | "done";
  type IConfirmInfo = {
    from: BridgeModel.BridgeSupportChain;
    to: BridgeModel.BridgeSupportChain;
    fromTokenMeta: BridgeModel.IBridgeTokenMeta;
    toTokenMeta: BridgeModel.IBridgeTokenMeta;
    amountIn: string;
    amountOut: string;
    recipient: string;
    sender: string;
    constTime: string;
  };
  type IWormholeStepData = {
    status: IWormholeStatus;
    result: {
      baseData: IConfirmInfo;
      resultData: any;
    };
  };
}
