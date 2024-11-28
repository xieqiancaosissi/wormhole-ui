import React, { useEffect, useMemo, useState } from "react";
import Big from "big.js";
import { Button as NextuiButton } from "@nextui-org/react";
import BridgeRoutes from "@/components/bridge/BridgeRoutes";
import Button from "@/components/bridge/Button";
import ConnectWallet from "@/components/bridge/ConnectWallet";
import InputToken from "@/components/bridge/InputToken";
import SlippageSelector from "@/components/bridge/StableSlipSelector";
import { TokenSelector } from "@/components/bridge/TokenSelector";
import { useBridgeFormContext } from "@/providers/bridgeForm";
import SvgIcon from "@/components/bridge/SvgIcon";
import { useRouter } from "next/router";
import { isValidEthereumAddress, isValidNearAddress } from "@/utils/validate";
import { getTokenMeta } from "@/utils/token";
import { useWalletConnectContext } from "@/providers/walletConcent";
import PartToNearBox from "@/components/refuel/partToNear";
import wormholeBridgeService from "@/services/bridge/wormhole";
import { EVMConfig } from "@/config/bridge";
import { ChainId } from "@certusone/wormhole-sdk";
import getConfig from "@/utils/config";
import { getTokensByChain } from "@/utils/token";
import { checkTransaction } from "@/utils/contract";
import { ftGetTokenMetadata } from "@/services/token";
import { getRoutes } from "@/utils/token";
import bridgeServices from "@/services/bridge";
const config = getConfig();

function FormHeader() {
  const {
    slippageTolerance,
    setSlippageTolerance,
    channelInfoMapLoading,
    refreshChannelInfoMap,
  } = useBridgeFormContext();
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="text-xl text-white font-SpaceGroteskBold font-bold bridge-primary-label">
        Bridge
      </div>
      <div className="flex items-center gap-3">
        <Button size="small" plain onClick={refreshChannelInfoMap}>
          <SvgIcon
            name="IconRefresh"
            className={channelInfoMapLoading ? "animate-spin text-primary" : ""}
          />
        </Button>
        <SlippageSelector
          slippageTolerance={(slippageTolerance || 0) * 100}
          onChange={(val) => setSlippageTolerance((val || 0) / 100)}
        >
          <Button size="small" plain>
            <SvgIcon name="IconSetting" />
          </Button>
        </SlippageSelector>
      </div>
    </div>
  );
}

function CustomAccountAddress() {
  const { bridgeToValue, setBridgeToValue } = useBridgeFormContext();
  const [customAccountAddress, setCustomAccountAddress] = useState(
    bridgeToValue.customAccountAddress
  );
  const [isFocus, setIsFocus] = useState(false);

  const isValidCustomAddress = useMemo(
    () =>
      !customAccountAddress ||
      (bridgeToValue.chain === "NEAR"
        ? isValidNearAddress(customAccountAddress)
        : isValidEthereumAddress(customAccountAddress)),
    [customAccountAddress, bridgeToValue.chain]
  );

  useEffect(() => {
    setBridgeToValue({
      ...bridgeToValue,
      customAccountAddress: isValidCustomAddress ? customAccountAddress : "",
    });
  }, [isValidCustomAddress, customAccountAddress]);

  function handlePasteAddress() {
    navigator.clipboard.readText().then((text) => {
      setCustomAccountAddress(text);
    });
  }

  return (
    <div className="mt-5">
      <label className="inline-flex items-center select-none mb-3 cursor-pointer">
        <input
          type="checkbox"
          className="bridge-checkbox mr-2"
          checked={bridgeToValue.isCustomAccountAddress}
          onChange={(e) => {
            setBridgeToValue({
              ...bridgeToValue,
              isCustomAccountAddress: e.target.checked,
              customAccountAddress: undefined,
            });
            setCustomAccountAddress("");
          }}
        />
        I&apos;m transferring to a destination address
      </label>
      {bridgeToValue.isCustomAccountAddress && (
        <div className="relative">
          <input
            type="text"
            className="bridge-input w-full"
            placeholder="Destination address"
            value={customAccountAddress ?? ""}
            onChange={(e) => setCustomAccountAddress(e.target.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          />
          <div
            className="absolute top-1/2 right-3 transform -translate-y-1/2"
            onClick={() => !isValidCustomAddress && setCustomAccountAddress("")}
          >
            {!customAccountAddress ? (
              <Button
                size="small"
                type="primary"
                text
                onClick={handlePasteAddress}
              >
                Paste
              </Button>
            ) : (
              !isFocus && (
                <SvgIcon
                  name={
                    isValidCustomAddress
                      ? "IconSuccessCircleFill"
                      : "IconErrorCircleFill"
                  }
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BridgeEntry() {
  const {
    bridgeFromValue,
    setBridgeFromValue,
    bridgeFromBalance,
    bridgeToValue,
    setBridgeToValue,
    bridgeToBalance,
    changeBridgeChain,
    exchangeChain,
    bridgeSubmitStatus,
    bridgeSubmitStatusText,
    openPreviewModal,
    feeWarning,
    channelInfoMapLoading,
    changeBridgeToken,
    bridgeChannel,
    openWormholeModal,
  } = useBridgeFormContext();

  const router = useRouter();
  function handleOpenHistory() {
    router.push("/bridge/history");
  }

  const { getWallet } = useWalletConnectContext();

  function handleConfirm() {
    if (bridgeSubmitStatus === "unConnectForm")
      return getWallet(bridgeFromValue.chain)?.open();
    else if (bridgeSubmitStatus === "unConnectTo")
      return getWallet(bridgeToValue.chain)?.open();
    else openPreviewModal();
  }
  function handleWormholeConfirm() {
    openWormholeModal();
  }
  const { supportFromAddresses, supportToAddresses } = useMemo(() => {
    const searchResult = getRoutes({
      fromChain: bridgeFromValue.chain,
      toChain: bridgeToValue.chain,
    });
    return searchResult;
  }, [bridgeFromValue.chain, bridgeToValue.chain]);
  return (
    <div className="bridge-entry-container">
      <form className="bridge-plane shadow-2xl">
        <FormHeader />
        <div className="flex items-center mb-3">
          <span className="mr-3">From</span>
          <ConnectWallet
            currentChain={bridgeFromValue.chain}
            connectPlaceholder=" "
            className="flex-1 justify-between"
            onChangeChain={(chain) => changeBridgeChain("from", chain)}
          />
        </div>
        <InputToken
          model={bridgeFromValue}
          balance={bridgeFromBalance}
          errorMessage={feeWarning}
          onChange={setBridgeFromValue}
        >
          <TokenSelector
            value={bridgeFromValue.tokenMeta}
            chain={bridgeFromValue.chain}
            selectableAddresses={supportFromAddresses}
            tokens={getTokensByChain(bridgeFromValue.chain)}
            onChange={(tokenMeta) =>
              changeBridgeToken({
                type: "from",
                token: tokenMeta,
              })
            }
          />
        </InputToken>

        <div className="flex justify-center my-3">
          <Button text onClick={() => exchangeChain()}>
            <SvgIcon name="IconExchange" />
          </Button>
        </div>
        <div className="flex items-center mb-3">
          <span className="mr-3">To</span>
          <ConnectWallet
            currentChain={bridgeToValue.chain}
            connectPlaceholder=" "
            className="flex-1 justify-between"
            onChangeChain={(chain) => changeBridgeChain("to", chain)}
          />
        </div>
        <InputToken
          model={bridgeToValue}
          balance={bridgeToBalance}
          inputReadonly
          disabled={bridgeToValue.isCustomAccountAddress}
          onChange={setBridgeToValue}
        >
          <TokenSelector
            value={bridgeToValue.tokenMeta}
            chain={bridgeToValue.chain}
            selectableAddresses={supportToAddresses}
            tokens={getTokensByChain(bridgeToValue.chain)}
            placeholder=""
            onChange={(tokenMeta) =>
              changeBridgeToken({
                type: "to",
                token: tokenMeta,
              })
            }
          />
        </InputToken>
        {bridgeChannel == "Stargate" ? <CustomAccountAddress /> : null}
        <BridgeRoutes />
        {bridgeFromValue.chain == "NEAR" ||
        bridgeChannel !== "Stargate" ? null : (
          <PartToNearBox />
        )}
        {/* Stargate Preview button */}
        {bridgeChannel == "Stargate" ? (
          <Button
            type="primary"
            loading={channelInfoMapLoading}
            size="large"
            className="w-full"
            disabled={
              bridgeSubmitStatus !== "preview" ||
              (bridgeSubmitStatus === "preview" && !!feeWarning) ||
              Big(bridgeToValue.amount || 0).lte(0)
            }
            onClick={handleConfirm}
          >
            {bridgeSubmitStatusText}
          </Button>
        ) : null}
        {/* Wormhole Preview button */}
        {bridgeChannel == "Wormhole" ? (
          <NextuiButton
            className="w-full bg-greenGradient rounded text-base text-black"
            onClick={handleWormholeConfirm}
            isDisabled={
              bridgeSubmitStatus !== "preview" ||
              Big(bridgeToValue.amount || 0).lte(0)
            }
          >
            {bridgeSubmitStatusText}
          </NextuiButton>
        ) : null}
      </form>
      <div className="mt-4 flex items-center justify-between">
        <Button text onClick={handleOpenHistory}>
          Bridge Transaction History
        </Button>
      </div>
    </div>
  );
}
