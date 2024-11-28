import {
  checkStatusAll,
  onChange,
  setBridgeParams,
  setEthProvider,
  setSignerProvider,
  setNearConnection,
  act,
} from "@near-eth/client";
import { BridgeConfig, EVMConfig, APPID } from "@/config/bridge";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useWalletConnectContext } from "@/providers/walletConcent";
import { toast } from "react-toastify";
import { Near, WalletConnection } from "near-api-js";
import { nearServices } from "@/services/bridge/contract";
import bridgeServices, { BridgeTransferParams } from "@/services/bridge";
import rainbowBridgeService from "@/services/bridge/rainbow";
import { logger } from "@/utils/common";
import { getTokenMeta, getTokenMetaByAddress } from "@/utils/token";

export default function useBridge(params?: {
  enableSubscribeUnclaimed?: boolean;
}) {
  const [actionLoading, setActionLoading] = useState(false);

  const wallet = useWalletConnectContext();

  const setupRainbowBridge = useCallback(() => {
    if (!wallet.EVM.isSignedIn && !wallet.NEAR.isSignedIn) return;
    setBridgeParams(BridgeConfig.Rainbow.bridgeParams);

    setNearConnection(
      new WalletConnection(
        new Near(nearServices.getNearConnectionConfig()),
        APPID
      ) as any
    );
    setEthProvider(
      new ethers.providers.InfuraProvider(
        EVMConfig.chains.ethereum.network,
        EVMConfig.chains.ethereum.infuraKey
      )
    );
    setSignerProvider(window.ethWeb3Provider);

    wallet.EVM.chain === "Ethereum" && checkStatusAll({ loop: 15000 });

    logger.log("bridge: setup rainbow");
  }, [wallet.EVM.isSignedIn, wallet.NEAR.isSignedIn, wallet.EVM.chain]);

  const [unclaimedTransactions, setUnclaimedTransactions] = useState<
    BridgeModel.BridgeTransaction[]
  >([]);

  useEffect(() => {
    if (params?.enableSubscribeUnclaimed) {
      function onSubscribeUnclaimedTransactions() {
        rainbowBridgeService
          .query({ filter: (v) => v.status === "action-needed" })
          .then((data) => setUnclaimedTransactions(data));
        onChange(() =>
          rainbowBridgeService
            .query({
              filter: (v) => v.status === "action-needed",
            })
            .then((data) => setUnclaimedTransactions(data))
        );
      }
      onSubscribeUnclaimedTransactions();
    }
  }, [params?.enableSubscribeUnclaimed]);

  async function transfer(params: BridgeTransferParams) {
    params.tokenIn = getTokenMetaByAddress({ address: params.tokenIn.address });
    params.tokenOut = getTokenMetaByAddress({
      address: params.tokenOut.address,
    });
    try {
      setActionLoading(true);
      const res = await bridgeServices.transfer(params);
      return res;
    } catch (error) {
      toast.error(error.message.substring(0, 100), { theme: "dark" });
    } finally {
      setActionLoading(false);
    }
  }
  async function callAction(id: string) {
    setActionLoading(true);
    const result = await act(id).catch((err) => {
      toast.error(err.message.substring(0, 100), { theme: "dark" });
    });
    setActionLoading(false);
    return result;
  }

  return {
    setupRainbowBridge,
    actionLoading,
    transfer,
    callAction,
    unclaimedTransactions,
  };
}
