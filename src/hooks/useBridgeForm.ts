import { useEffect, useMemo, useState } from "react";
import Big from "big.js";
import { useDebounce } from "react-use";
import { useWalletConnectContext } from "@/providers/walletConcent";
import { useDebouncedEffect, useRequest, useStorageState } from "./useHooks";
import { tokenServices } from "@/services/bridge/contract";
import { EVMConfig } from "@/config/bridge";
import {
  getRoutes,
  getTokenMetaByAddress,
  getCanBridgeTokens,
} from "@/utils/token";
import bridgeServices from "@/services/bridge";
import {
  TOKENS_ON_ARBITRUM,
  TOKENS_ON_NEAR,
} from "@/config/bridgeTokensOnChain";

export default function useBridgeForm() {
  const [bridgeFromValue, setBridgeFromValue] = useStorageState<
    BridgeModel.BridgeTransferFormData["from"]
  >("bridgeFromValue", {
    chain: "NEAR",
    tokenMeta: TOKENS_ON_NEAR[0],
    amount: undefined,
  });
  const [bridgeToValue, setBridgeToValue] = useStorageState<
    BridgeModel.BridgeTransferFormData["to"]
  >("bridgeToValue", {
    chain: "Arbitrum",
    tokenMeta: TOKENS_ON_ARBITRUM[0],
    amount: undefined,
    isCustomAccountAddress: false,
    customAccountAddress: undefined,
  });
  const [slippageTolerance, setSlippageTolerance] = useStorageState(
    "slippageTolerance",
    0.005
  );

  const [bridgeChannel, setBridgeChannel] =
    useState<BridgeModel.BridgeSupportChannel>();
  const [mode, setMode] = useState<BridgeModel.BridgeMode>(1);
  const [estimateResult, setEstimateResult] = useState(null);
  const [estimateError, setEstimateError] = useState<Error>(null);
  const [bridgeFromBalance, setBridgeFromBalance] = useState<string>("0");
  const [bridgeToBalance, setBridgeToBalance] = useState<string>("0");
  const {
    getWallet,
    EVM: { setChain },
  } = useWalletConnectContext();
  // get support channels
  const supportBridgeChannels = useMemo(() => {
    const supports: BridgeModel.BridgeSupportChannel[] = [];
    const { supportChannels } = getRoutes({
      fromChain: bridgeFromValue.chain,
      toChain: bridgeToValue.chain,
    });
    supportChannels.forEach((channelData) => {
      const t = channelData.routes.find(
        (route) =>
          route.fromAddress == bridgeFromValue.tokenMeta.address &&
          route.toAddress == bridgeToValue.tokenMeta.address
      );
      if (t) supports.push(channelData.channel);
    });
    return supports;
  }, [bridgeFromValue, bridgeToValue]);
  // get fromAccountAddress
  const fromAccountAddress = useMemo(
    () => getWallet(bridgeFromValue.chain)?.accountId,
    [getWallet(bridgeFromValue.chain)?.accountId]
  );
  // get toAccountAddress
  const toAccountAddress = useMemo(() => {
    return bridgeToValue.isCustomAccountAddress
      ? bridgeToValue.customAccountAddress
      : getWallet(bridgeToValue.chain)?.accountId;
  }, [
    getWallet(bridgeToValue.chain)?.accountId,
    bridgeToValue.isCustomAccountAddress,
    bridgeToValue.customAccountAddress,
  ]);
  // Stargate, Estimating
  const queryParams = {
    ...bridgeFromValue,
    slippageTolerance,
    mode,
  };
  const {
    data: channelInfoMap,
    loading: channelInfoMapLoading,
    run: refreshChannelInfoMap,
    error: channelError,
    setLoading: channelSetLoading,
  } = useRequest(
    async () => {
      const result = {} as Record<
        BridgeModel.BridgeSupportChannel,
        Awaited<ReturnType<typeof bridgeServices.query>>
      >;
      if (!fromAccountAddress) return result;
      for (const channel of supportBridgeChannels) {
        result[channel] = await bridgeServices.query({
          tokenIn: bridgeFromValue.tokenMeta,
          tokenOut: bridgeToValue.tokenMeta,
          amount: bridgeFromValue.amount,
          from: bridgeFromValue.chain,
          to: bridgeToValue.chain,
          recipient: toAccountAddress,
          sender: fromAccountAddress,
          channel,
          slippage: slippageTolerance,
          mode,
        });
      }
      return result;
    },
    {
      refreshDeps: [
        bridgeFromValue.chain,
        bridgeFromValue.tokenMeta,
        bridgeFromValue.amount,
        bridgeToValue.chain,
        bridgeChannel,
        slippageTolerance,
        mode,
      ],
      before: () =>
        !!fromAccountAddress &&
        bridgeChannel == "Stargate" &&
        Big(bridgeFromValue.amount || 0).gt(0),
      debounceOptions: { wait: 500 },
    }
  );
  // Stargate Estimate result Check
  useEffect(() => {
    const tag = channelInfoMap?.Stargate?.queryParamsTag;
    const valid =
      tag?.amount == queryParams.amount &&
      tag?.chain == queryParams.chain &&
      tag?.mode == queryParams.mode &&
      tag?.slippage == queryParams.slippageTolerance;
    if (
      !channelError &&
      Big(queryParams.amount || 0).gt(0) &&
      Big(tag?.amount || 0).gt(0) &&
      valid
    ) {
      setEstimateResult({
        channelInfoMap,
        queryParams,
      });
      setEstimateError(null);
      return;
    } else if (channelError) {
      setEstimateError(channelError);
      return;
    }
  }, [
    JSON.stringify(channelInfoMap || {}),
    channelError,
    JSON.stringify(queryParams || {}),
  ]);
  // get amountOut of channel  Stargate | Wormhole
  useEffect(() => {
    if (!fromAccountAddress || Big(bridgeFromValue.amount || 0).lte(0)) {
      setBridgeFromValue({
        ...bridgeFromValue,
        amount: bridgeFromValue.amount || undefined,
      });
      setBridgeToValue({
        ...bridgeToValue,
        amount: undefined,
      });
      channelSetLoading(false);
    } else if (bridgeChannel == "Stargate") {
      const amountOut = bridgeChannel
        ? channelInfoMap?.[bridgeChannel]?.readableMinAmount
        : Object.values(channelInfoMap || {})[0]?.readableMinAmount;
      setBridgeToValue({
        ...bridgeToValue,
        amount: amountOut,
      });
    } else if (bridgeChannel == "Wormhole") {
      setBridgeToValue({
        ...bridgeToValue,
        amount: bridgeFromValue.amount,
      });
      channelSetLoading(false);
    }
  }, [
    fromAccountAddress,
    channelInfoMap,
    bridgeChannel,
    bridgeFromValue.amount,
  ]);
  // switch chain
  useDebouncedEffect(
    () => {
      const fromValue = { ...bridgeFromValue };
      if (fromValue.chain !== "NEAR")
        setChain(EVMConfig.chains[fromValue.chain.toLowerCase()]?.id);
    },
    [bridgeFromValue.chain],
    200
  );
  // get from token balance
  const { data: bridgeFromBalancePending = "0" } = useRequest(
    async () => {
      if (!getWallet(bridgeFromValue.chain)?.accountId) return "0";
      return tokenServices.getBalance(
        bridgeFromValue.chain,
        bridgeFromValue.tokenMeta,
        true
      );
    },
    {
      refreshDeps: [
        bridgeFromValue.chain,
        bridgeFromValue.tokenMeta,
        getWallet(bridgeFromValue.chain)?.accountId,
      ],
      before: () => !!bridgeFromValue.chain && !!bridgeFromValue.tokenMeta,
      debounceOptions: 200,
      pollingInterval: 10000,
    }
  );
  // get to token balance
  const { data: bridgeToBalancePending = "0" } = useRequest(
    async () => {
      if (!getWallet(bridgeToValue.chain)?.accountId) return "0";
      return tokenServices.getBalance(
        bridgeToValue.chain,
        bridgeToValue.tokenMeta,
        true
      );
    },
    {
      refreshDeps: [
        bridgeToValue.chain,
        bridgeToValue.tokenMeta,
        getWallet(bridgeToValue.chain)?.accountId,
      ],
      before: () => !!bridgeToValue.chain && !!bridgeToValue.tokenMeta,
      debounceOptions: 200,
      pollingInterval: 10000,
    }
  );
  useDebounce(
    () => {
      setBridgeFromBalance(bridgeFromBalancePending);
    },
    300,
    [bridgeFromBalancePending]
  );
  useDebounce(
    () => {
      setBridgeToBalance(bridgeToBalancePending);
    },
    300,
    [bridgeToBalancePending]
  );
  // get source chain gasToken balance
  const { data: gasTokenBalance = "0" } = useRequest(
    async () => {
      const res = await tokenServices.getMainTokenBalance(
        bridgeFromValue.chain,
        true
      );
      return res;
    },
    {
      refreshDeps: [bridgeFromValue.chain],
      before: () => !!bridgeFromValue.chain,
      debounceOptions: 200,
      pollingInterval: 10000,
    }
  );
  // get button status
  const bridgeSubmitStatus = useMemo<
    | "unConnectForm"
    | "unConnectTo"
    | "enterToAddress"
    | "enterAmount"
    | "preview"
    | "insufficientBalance"
    | "NetworkError"
  >(() => {
    if (!fromAccountAddress) return `unConnectForm`;
    else if (
      bridgeToValue.isCustomAccountAddress &&
      !bridgeToValue.customAccountAddress
    )
      return `enterToAddress`;
    else if (!toAccountAddress) return `unConnectTo`;
    else if (!bridgeFromValue.amount) return `enterAmount`;
    else if (
      new Big(bridgeFromBalance).eq(0) ||
      new Big(bridgeFromBalance).lt(bridgeFromValue.amount)
    )
      return `insufficientBalance`;
    else if (estimateError && bridgeChannel == "Stargate") {
      return `NetworkError`;
    } else return `preview`;
  }, [
    bridgeFromValue.chain,
    bridgeFromValue.amount,
    bridgeFromBalance,
    fromAccountAddress,
    toAccountAddress,
    bridgeToValue.isCustomAccountAddress,
    bridgeToValue.customAccountAddress,
    estimateError,
    bridgeChannel,
  ]);
  // get button text
  const bridgeSubmitStatusText = useMemo(() => {
    switch (bridgeSubmitStatus) {
      case `enterToAddress`:
        return `Enter Destination Address`;
      case `enterAmount`:
        return `Enter amount`;
      case `insufficientBalance`:
        return `Insufficient balance`;
      case `NetworkError`:
        return "Network error";
      default:
        return `Preview`;
    }
  }, [bridgeSubmitStatus, bridgeFromValue.chain, bridgeToValue.chain]);
  // get fee wraning
  const feeWarning = useMemo(() => {
    if (
      !getWallet(bridgeFromValue.chain).isSignedIn ||
      channelInfoMapLoading ||
      new Big(bridgeFromValue.amount || 0).eq(0) ||
      bridgeChannel !== "Stargate"
    )
      return;
    if (bridgeChannel === "Stargate" && bridgeFromValue.chain === "NEAR") {
      if (
        estimateResult?.channelInfoMap?.[bridgeChannel]?.insufficientFeeBalance
      ) {
        return `The bridge is too busy, please try again later.`;
      }
      if (
        new Big(
          estimateResult?.channelInfoMap?.[bridgeChannel]?.readableFeeAmount ||
            0
        ).gt(bridgeFromValue.amount)
      ) {
        return `Your ${bridgeFromValue.tokenMeta.symbol} cannot cover the Bridge Fee.`;
      }
    }
    // if (new Big(gasTokenBalance).eq(0)) return "Not enough gas fee.";
  }, [
    getWallet(bridgeFromValue.chain).isSignedIn,
    bridgeFromValue.amount,
    bridgeChannel,
    bridgeFromValue.chain,
    estimateResult,
    gasTokenBalance,
    channelInfoMapLoading,
  ]);
  // change chain by manual
  function changeBridgeChain(
    type: "from" | "to",
    chain: BridgeModel.BridgeSupportChain
  ) {
    const {
      chain: oldFromChain,
      tokenMeta: oldFromTokenMeta,
      amount: oldFromAmount,
    } = bridgeFromValue;
    const {
      chain: oldToChain,
      tokenMeta: oldToTokenMeta,
      amount: oldToAmount,
    } = bridgeToValue;
    if (type === "from") {
      if (oldFromChain === chain) return;
      else {
        const toChain = chain === "NEAR" ? "Arbitrum" : "NEAR";
        const { supportFromAddresses } = getRoutes({
          fromChain: chain,
          toChain,
        });
        const fromToken = getTokenMetaByAddress({
          chain,
          address: supportFromAddresses[0],
        });
        const toToken = getCanBridgeTokens({
          fromChain: chain,
          toChain,
          token: fromToken,
        })[0];
        setBridgeFromValue({
          chain,
          tokenMeta: fromToken,
          amount: oldFromAmount,
        });
        setBridgeToValue({
          chain: toChain,
          tokenMeta: toToken,
          amount: undefined,
        });
      }
    } else {
      if (oldToChain === chain) return;
      else {
        const fromChain = chain === "NEAR" ? "Arbitrum" : "NEAR";
        const { supportToAddresses } = getRoutes({
          fromChain,
          toChain: chain,
        });
        const toToken = getTokenMetaByAddress({
          chain,
          address: supportToAddresses[0],
        });
        const fromToken = getCanBridgeTokens({
          fromChain,
          toChain: chain,
          token: toToken,
        })[0];
        setBridgeToValue({
          chain,
          tokenMeta: toToken,
          amount: undefined,
        });
        setBridgeFromValue({
          chain: fromChain,
          tokenMeta: fromToken,
          amount: oldFromAmount,
        });
      }
    }
  }
  // change token by manual
  function changeBridgeToken({
    type,
    token,
  }: {
    type: "from" | "to";
    token: BridgeModel.IBridgeTokenMeta;
  }) {
    const canBridgeTokens = getCanBridgeTokens({
      fromChain: bridgeFromValue.chain,
      toChain: bridgeToValue.chain,
      token,
    });
    if (type == "from") {
      setBridgeFromValue({ ...bridgeFromValue, tokenMeta: token });
      const target = canBridgeTokens.find(
        (token) => token.address == bridgeToValue.tokenMeta.address
      );
      if (!target) {
        setBridgeToValue({ ...bridgeToValue, tokenMeta: canBridgeTokens[0] });
      }
    }
    if (type == "to") {
      setBridgeToValue({ ...bridgeToValue, tokenMeta: token });
      const target = canBridgeTokens.find(
        (token) => token.address == bridgeFromValue.tokenMeta.address
      );
      if (!target) {
        setBridgeFromValue({
          ...bridgeFromValue,
          tokenMeta: canBridgeTokens[0],
        });
      }
    }
  }
  // exchange by manual
  function exchangeChain(restToken?: boolean) {
    const {
      chain: fromChain,
      tokenMeta: fromTokenMeta,
      amount,
    } = bridgeFromValue;
    const { chain: toChain, tokenMeta: toTokenMeta } = bridgeToValue;

    const fromValue = {
      chain: toChain,
      tokenMeta: toTokenMeta,
      amount,
    };
    const toValue = {
      chain: fromChain,
      tokenMeta: fromTokenMeta,
      isCustomAccountAddress: false,
      customAccountAddress: undefined,
    };

    if (restToken) {
      fromValue.tokenMeta = undefined;
      toValue.tokenMeta = undefined;
    }
    setBridgeFromValue(fromValue);
    setBridgeToValue(toValue);
    setBridgeFromBalance(bridgeToBalance);
    setBridgeToBalance(bridgeFromBalance);
  }
  // get loading status
  const estimateLoading =
    bridgeChannel == "Stargate" &&
    !estimateError &&
    !feeWarning &&
    estimateResult &&
    Big(queryParams.amount || 0).gt(0) &&
    (estimateResult.queryParams?.amount !== queryParams.amount ||
      estimateResult.queryParams?.mode !== queryParams.mode);
  return {
    bridgeChannel,
    setBridgeChannel,
    bridgeFromValue,
    setBridgeFromValue,
    bridgeFromBalance,
    bridgeToValue,
    setBridgeToValue,
    supportBridgeChannels,
    bridgeToBalance,
    changeBridgeChain,
    exchangeChain,
    bridgeSubmitStatus,
    bridgeSubmitStatusText,
    feeWarning,
    slippageTolerance,
    setSlippageTolerance,
    channelInfoMap: estimateResult?.channelInfoMap,
    channelInfoMapLoading: channelInfoMapLoading || estimateLoading,
    channelError: estimateError,
    refreshChannelInfoMap,
    fromAccountAddress,
    toAccountAddress,
    mode,
    setMode,
    changeBridgeToken,
  };
}
