export type Bytes = ArrayLike<number>;
export type BytesLike = Bytes | string;
export interface Hexable {
  toHexString(): string;
}
export type DataOptions = {
  allowMissingPrefix?: boolean;
  hexPad?: "left" | "right" | null;
};
export interface GetSignedVAAWithRetryResult {
  vaaBytes: Uint8Array | undefined;
  isPending: boolean;
}
export interface ISupportTokensOnChain {
  address: string;
  symbol: string;
  decimals: number;
  channel: BridgeModel.BridgeSupportChannel[];
  chain: BridgeModel.BridgeSupportChain;
  name?: string;
  icon?: string;
}
export interface IRoute {
  fromAddress: string;
  toAddress: string;
  symbol: string;
}

export interface IBridgeTokenRoutes {
  from: BridgeModel.BridgeSupportChain;
  to: BridgeModel.BridgeSupportChain;
  channel: BridgeModel.BridgeSupportChannel;
  symbols: string[];
  protocolFeeRatio?: number;
  routes: IRoute[];
}
