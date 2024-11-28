import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { Image, Button as NextUIButton } from "@nextui-org/react";
import { Snippet } from "@nextui-org/snippet";
import { ChainId } from "@certusone/wormhole-sdk";
import Countdown, { zeroPad } from "react-countdown";
import SvgIcon from "./SvgIcon";
import Button from "./Button";
import { useBridgeFormContext } from "@/providers/bridgeForm";
import { EVMConfig } from "@/config/bridge";
import {
  formatChainName,
  formatNumber,
  formatSortAddress,
} from "@/utils/format";
import { BridgeConfig } from "@/config/bridge";
import { useWormholePersistStore } from "@/stores/wormhole";
import wormholeBridgeService from "@/services/bridge/wormhole";
import { formatTxExplorerUrl } from "@/utils/format";
import failToast from "@/components/common/toast/failToast";
import { checkTransaction } from "@/utils/contract";
export default function WormholeModal({
  toggleOpenModal,
  ...props
}: Modal.Props & { toggleOpenModal: () => void }) {
  const {
    fromAccountAddress,
    toAccountAddress,
    bridgeFromValue,
    bridgeToValue,
    bridgeChannel,
  } = useBridgeFormContext();
  const { setRedeem, setTransfer, setFetchSignedVaa } =
    useWormholePersistStore();
  const sender = fromAccountAddress;
  const recipient = toAccountAddress;
  const confirmInfo: BridgeModel.IConfirmInfo = useMemo(
    () => ({
      from: bridgeFromValue?.chain,
      to: bridgeToValue?.chain,
      fromTokenMeta: bridgeFromValue?.tokenMeta,
      toTokenMeta: bridgeToValue?.tokenMeta,
      amountIn: bridgeFromValue?.amount,
      amountOut: bridgeToValue?.amount,
      recipient,
      sender,
      constTime:
        bridgeFromValue?.chain == "NEAR"
          ? BridgeConfig[bridgeChannel]?.estimateWaitTextFromNear
          : BridgeConfig[bridgeChannel]?.estimateWaitTextFromEvm,
    }),
    [bridgeFromValue, bridgeToValue, bridgeChannel, sender, recipient]
  );
  function closeModal() {
    const initState = {
      status: "unDone",
      result: null,
    } as BridgeModel.IWormholeStepData;
    setTransfer(initState);
    setFetchSignedVaa(initState);
    setRedeem(initState);
    toggleOpenModal();
  }
  return (
    <>
      <Modal
        {...props}
        overlayClassName="modal-overlay"
        // onRequestClose={toggleOpenModal}
      >
        <div
          className="bridge-modal"
          style={{ width: "458px", maxHeight: "80vh", overflow: "auto" }}
        >
          {/* head */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center">
              {/* <Button size="small" plain onClick={() => setLoading(true)}>
                <SvgIcon
                  name="IconRefresh"
                  className={loading ? "animate-spin text-primary" : ""}
                />
              </Button> */}
              <Button className="ml-4" text onClick={closeModal}>
                <SvgIcon name="IconClose" />
              </Button>
            </div>
          </div>
          {/* Step1 */}
          <Step1 confirmInfo={confirmInfo} />
          {/* Step2 */}
          <Step2 confirmInfo={confirmInfo} />
          {/* Step3 */}
          <Step3 confirmInfo={confirmInfo} toggleOpenModal={toggleOpenModal} />
        </div>
      </Modal>
    </>
  );
}
function Step1({ confirmInfo }: { confirmInfo: BridgeModel.IConfirmInfo }) {
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [fold, setFold] = useState<boolean>(true);
  const { transfer, setTransfer, setFetchSignedVaa } =
    useWormholePersistStore();
  const { isDone } = useMemo(() => {
    return {
      isDone: transfer.status == "done",
    };
  }, [transfer]);
  useEffect(() => {
    if (isDone) {
      setFold(true);
    } else {
      setFold(false);
    }
  }, [isDone]);
  function toggleFold() {
    setFold(!fold);
  }
  async function handleTransfer() {
    setActionLoading(true);
    if (confirmInfo.from == "NEAR") {
      const res = await wormholeBridgeService
        .transferTokenFromNear({
          token: confirmInfo.fromTokenMeta,
          amount: confirmInfo.amountIn,
          receiver: confirmInfo.recipient,
          targetChain: confirmInfo.to,
        })
        .finally(() => {
          setActionLoading(false);
        });
      if (res.status == "success") {
        setTransfer({
          status: "done",
          result: {
            baseData: confirmInfo,
            resultData: res,
          },
        });
        setFetchSignedVaa({
          status: "going",
          result: {
            baseData: confirmInfo,
            resultData: null,
          },
        });
        const successResult: any = await checkTransaction(res.txHash);
        const signedVaa = await wormholeBridgeService.fetchSignedVAAOnNear({
          receipt: successResult,
        });
        setFetchSignedVaa({
          status: "done",
          result: {
            baseData: confirmInfo,
            resultData: signedVaa,
          },
        });
      } else if (res.status == "error") {
        failToast(res.errorResult?.message);
      }
    } else {
      try {
        const signer = await window.ethWeb3Provider?.getSigner();
        await wormholeBridgeService.approveOnEth({
          fromChain: confirmInfo.from,
          signer,
          amount: confirmInfo.amountIn,
          token: confirmInfo.fromTokenMeta,
        });
        const receipt = await wormholeBridgeService.transferOnEvm({
          isNative: false,
          fromChain: confirmInfo.from,
          signer,
          amount: confirmInfo.amountIn,
          token: confirmInfo.fromTokenMeta,
        });
        setTransfer({
          status: "done",
          result: {
            baseData: confirmInfo,
            resultData: receipt,
          },
        });
        setFetchSignedVaa({
          status: "going",
          result: {
            baseData: confirmInfo,
            resultData: null,
          },
        });
        const signedVaa = await wormholeBridgeService.fetchSignedVAAOnEvm({
          receipt,
          fromChain: confirmInfo.from,
        });
        setFetchSignedVaa({
          status: "done",
          result: {
            baseData: confirmInfo,
            resultData: signedVaa,
          },
        });
      } catch (error) {
        setActionLoading(false);
        failToast(error.message.substring(0, 100));
      }
    }
  }
  return (
    <div className="">
      {/* title */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleFold}
      >
        <CheckBox checked={transfer?.status == "done"} />
        <span
          className={`text-base ${
            !isDone ? "text-primaryGreen" : "text-gray-60"
          }`}
        >
          <span className="mr-2">Step 1:</span>
          <span className={!isDone ? "text-white" : ""}>Send Tokens</span>
        </span>
      </div>
      {/* content */}
      <div className={`${fold ? "hidden" : ""}`}>
        <div className="text-sm text-gray-60 mt-4">You will send</div>
        {/* amount */}
        <div className="flex items-center justify-around gap-5 text-white py-5">
          <div className="flex items-center justify-center">
            <div className="w-7 h-7  rounded-full mr-2 overflow-hidden flex-shrink-0">
              <Image
                src={confirmInfo?.fromTokenMeta?.icon}
                width={28}
                height={28}
                alt={confirmInfo?.fromTokenMeta?.symbol}
              />
            </div>
            {formatNumber(confirmInfo?.amountIn)}{" "}
            {confirmInfo?.fromTokenMeta?.symbol}
          </div>
          <SvgIcon name="IconDirection" className="text-white" />
          <div className="flex items-center justify-center">
            <div className="w-7 h-7  rounded-full mr-2 overflow-hidden flex-shrink-0">
              <Image
                src={confirmInfo?.toTokenMeta?.icon}
                width={28}
                height={28}
                alt={confirmInfo?.toTokenMeta?.symbol}
              />
            </div>
            {formatNumber(confirmInfo?.amountOut)}{" "}
            {confirmInfo?.toTokenMeta?.symbol}
          </div>
        </div>
        {/* account */}
        <div className="flex items-center gap-5 mb-7">
          <div
            className="flex-1 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(126, 138, 147, 0.10)" }}
          >
            <div className="mb-2">
              From{" "}
              <span className="text-white">
                {formatChainName(confirmInfo?.from)}
              </span>
            </div>
            <div className="text-white">
              {formatSortAddress(confirmInfo.sender)}
            </div>
          </div>
          <div
            className="flex-1 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(126, 138, 147, 0.10)" }}
          >
            <div className="mb-2">
              To{" "}
              <span className="text-white">
                {formatChainName(confirmInfo?.to)}
              </span>
            </div>
            <div className="text-white">
              {formatSortAddress(confirmInfo?.recipient)}
            </div>
          </div>
        </div>
        {/* fee */}
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <div>Received</div>
            <div>
              <div className="text-white text-right">
                {confirmInfo.amountOut} {confirmInfo.toTokenMeta?.symbol}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>Cost Time</div>
            <div>
              <div className="text-white text-right">
                {confirmInfo.constTime}
              </div>
            </div>
          </div>
        </div>
        {/* transfer Button */}
        {isDone ? null : (
          <NextUIButton
            variant="bordered"
            className="w-full mt-4 rounded border border-green-10 text-base text-green-10 font-bold"
            isLoading={actionLoading}
            spinner={<SvgIcon name="IconLoading" />}
            onClick={handleTransfer}
          >
            Transfer
          </NextUIButton>
        )}
      </div>
    </div>
  );
}
function Step2({ confirmInfo }: { confirmInfo: BridgeModel.IConfirmInfo }) {
  const [fold, setFold] = useState<boolean>(true);
  const { fetchSignedVaa, transfer } = useWormholePersistStore();
  const { isDone, isGoing, isUnDone } = useMemo(() => {
    const isDone = fetchSignedVaa.status == "done";
    const isGoing = fetchSignedVaa.status == "going";
    const isUnDone = fetchSignedVaa.status == "unDone";
    return {
      isDone,
      isGoing,
      isUnDone,
    };
  }, [fetchSignedVaa]);
  const transactionHash =
    transfer?.result?.resultData?.transactionHash ||
    transfer?.result?.resultData?.txHash;
  useEffect(() => {
    if (isGoing) {
      setFold(false);
    } else {
      setFold(true);
    }
  }, [isGoing]);
  const finishTime = useMemo(() => {
    if (isGoing) {
      return Date.now() + 1000 * 60 * 25;
    }
  }, [isGoing]);
  function toggleFold() {
    setFold(!fold);
  }
  function jumpToExplore() {
    const url = formatTxExplorerUrl(confirmInfo.from, transactionHash);
    if (url) {
      window.open(url);
    }
  }
  function jumpToWormholeExplore() {
    const url = formatTxExplorerUrl(confirmInfo.from, transactionHash, true);
    if (url) {
      window.open(url);
    }
  }
  return (
    <div className="mt-10">
      {/* title */}
      <div
        className={`flex items-center gap-2 ${
          isUnDone ? "" : "cursor-pointer"
        }`}
        onClick={toggleFold}
      >
        <CheckBox checked={isDone} />
        <span
          className={`text-base ${
            !isDone ? "text-primaryGreen" : "text-gray-60"
          }`}
        >
          <span className="mr-2">Step 2:</span>
          {["unDone", "going"].includes(fetchSignedVaa?.status) ? (
            <span className="text-white">Fetching VAA</span>
          ) : null}
          {isDone ? <span>Fetched Signed VAA</span> : null}
        </span>
      </div>
      {/* content */}
      {isUnDone ? null : (
        <div
          className={`${
            fold ? "hidden" : ""
          } bg-gray-10 bg-opacity-10 rounded p-5 mt-4`}
        >
          {/* fetching */}
          {isGoing ? (
            <div className="">
              {/* account */}
              <div className="flex items-center justify-center my-4 gap-2">
                <div className="flex items-center">
                  <Image
                    src={confirmInfo?.fromTokenMeta?.icon}
                    width={28}
                    height={28}
                    alt={confirmInfo?.fromTokenMeta?.symbol}
                  />
                  <div className="bridge-status-process">
                    <SvgIcon
                      name="IconWaiting"
                      className="text-5xl animate-waiting"
                    />
                  </div>
                  <Image
                    src={confirmInfo?.toTokenMeta?.icon}
                    width={28}
                    height={28}
                    alt={confirmInfo?.toTokenMeta?.symbol}
                  />
                </div>
              </div>
              {/* time */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center  gap-1.5">
                  <span className="text-sm text-white">
                    Time to {confirmInfo?.to}:
                  </span>
                  <span className="text-sm text-primaryGreen">
                    {confirmInfo?.constTime}
                  </span>
                </div>
                {confirmInfo.to == "NEAR" ? (
                  <Countdown
                    date={finishTime}
                    renderer={(countdown) => {
                      if (countdown.completed) {
                        return <div>Please wait a moment</div>;
                      } else {
                        return (
                          <div>
                            {zeroPad(countdown.minutes)}
                            {"m"}
                            {countdown.days
                              ? ""
                              : ": " + zeroPad(countdown.seconds) + "s"}
                          </div>
                        );
                      }
                    }}
                  />
                ) : null}
              </div>
            </div>
          ) : null}

          {/* fetched */}
          {isDone ? (
            <div className="flex flex-col items-center text-sm gap-1">
              <span className="text-white">
                The tokens have entered the bridge!
              </span>
              <Snippet
                symbol=""
                className="mt-2 bg-transparent text-sm text-gray-60"
              >
                <div className="max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis text-center">
                  {transactionHash}
                </div>
              </Snippet>
            </div>
          ) : null}
          {/* explore button */}
          <div className="flex items-center justify-between gap-2.5 mt-4">
            <NextUIButton
              variant="bordered"
              className="w-1 flex-grow rounded-3xl text-sm text-white border border-white border-opacity-50"
              onClick={jumpToExplore}
            >
              View on {confirmInfo.from}
            </NextUIButton>
            <NextUIButton
              variant="bordered"
              className="w-1 flex-grow rounded-3xl text-sm text-white border border-white border-opacity-50"
              onClick={jumpToWormholeExplore}
            >
              View on Wormholescan
            </NextUIButton>
          </div>
        </div>
      )}
    </div>
  );
}
function Step3({
  confirmInfo,
  toggleOpenModal,
}: {
  confirmInfo: BridgeModel.IConfirmInfo;
  toggleOpenModal: () => void;
}) {
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [fold, setFold] = useState<boolean>(true);
  const { fetchSignedVaa, redeem, setRedeem, setTransfer, setFetchSignedVaa } =
    useWormholePersistStore();
  const { fetchSignedVaaIsDone } = useMemo(() => {
    return {
      fetchSignedVaaIsDone: fetchSignedVaa.status == "done",
      fetchSignedVaaIsDoneIsGoing: fetchSignedVaa.status == "going",
      fetchSignedVaaIsDoneIsUnDone: fetchSignedVaa.status == "unDone",
    };
  }, [fetchSignedVaa]);
  const transactionHash =
    redeem?.result?.resultData?.transactionHash ||
    redeem?.result?.resultData?.txHash;
  const { isDone, isUnDone } = useMemo(() => {
    const isDone = redeem.status == "done";
    const isGoing = redeem.status == "going";
    const isUnDone = redeem.status == "unDone";
    return {
      isDone,
      isGoing,
      isUnDone,
    };
  }, [redeem]);
  useEffect(() => {
    if (isUnDone && fetchSignedVaaIsDone) {
      setFold(false);
    }
  }, [isUnDone, fetchSignedVaaIsDone]);
  function toggleFold() {
    setFold(!fold);
  }
  async function onRedeem() {
    setActionLoading(true);
    if (confirmInfo.to == "NEAR") {
      const res = await wormholeBridgeService
        .redeemOnNear({
          vaa: fetchSignedVaa.result.resultData,
        })
        .finally(() => {
          setActionLoading(false);
        });
      if (res.status == "success") {
        setRedeem({
          status: "done",
          result: {
            baseData: confirmInfo,
            resultData: res,
          },
        });
      } else if (res.status == "error") {
        failToast(res.errorResult?.message);
      }
    } else {
      try {
        const signer = await window.ethWeb3Provider?.getSigner();
        setRedeem({
          status: "going",
          result: null,
        });
        const receipt = await wormholeBridgeService.redeemOnEvm({
          isNative: false,
          chainId: EVMConfig.chains[confirmInfo.to.toLocaleLowerCase()]
            .whChainId as ChainId,
          signer,
          signedVAAHex: fetchSignedVaa.result.resultData,
        });
        setRedeem({
          status: "done",
          result: {
            baseData: confirmInfo,
            resultData: receipt,
          },
        });
      } catch (error) {
        failToast(error.message.substring(0, 100));
      } finally {
        setActionLoading(false);
      }
    }
  }
  function jumpToExplore() {
    const url = formatTxExplorerUrl(confirmInfo.to, transactionHash);
    if (url) {
      window.open(url);
    }
  }
  function jumpToWormholeExplore() {
    const url = formatTxExplorerUrl(confirmInfo.to, transactionHash, true);
    if (url) {
      window.open(url);
    }
  }
  function complete() {
    const initState = {
      status: "unDone",
      result: null,
    } as BridgeModel.IWormholeStepData;
    setTransfer(initState);
    setFetchSignedVaa(initState);
    setRedeem(initState);
    toggleOpenModal();
  }
  return (
    <div className="mt-10">
      {/* title */}
      <div
        className={`flex items-center gap-2 ${
          fetchSignedVaaIsDone ? "cursor-pointer" : ""
        }`}
        onClick={toggleFold}
      >
        <CheckBox checked={isDone} />
        <span
          className={`text-base ${
            !isDone ? "text-primaryGreen" : "text-gray-60"
          }`}
        >
          <span className="mr-2">Step 3:</span>
          <span className={!isDone ? "text-white" : ""}>Redeem Tokens</span>
        </span>
      </div>
      {!fetchSignedVaaIsDone ? null : (
        <div className={`${fold ? "hidden" : ""} mt-4`}>
          {/* content redeem */}
          {!isDone ? (
            <div>
              <div className="bg-gray-10 bg-opacity-10 rounded p-5">
                <div className="flex items-center justify-center text-base text-white">
                  Receive the tokens on the target chain
                </div>
                <Snippet
                  symbol=""
                  className="flex items-center justify-center text-base text-primaryGreen bg-transparent"
                >
                  <div className=" max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {confirmInfo.recipient}
                  </div>
                </Snippet>
              </div>
              {/* Redeem button */}
              <NextUIButton
                variant="bordered"
                className="w-full mt-4 rounded border border-green-10 text-base text-green-10 font-bold"
                isLoading={actionLoading}
                spinner={<SvgIcon name="IconLoading" />}
                onClick={onRedeem}
              >
                Redeem
              </NextUIButton>
            </div>
          ) : null}

          {/* content redeem success */}
          {isDone ? (
            <div>
              <div className="bg-gray-10 bg-opacity-10 rounded p-5">
                <div className="flex items-center justify-center text-center text-base text-white">
                  Success! The token will become available once the transaction
                  confirms.
                </div>
                <Snippet
                  symbol=""
                  className="mt-2 text-sm text-gray-60 bg-transparent"
                >
                  <div className="max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {transactionHash}
                  </div>
                </Snippet>
                {/* explore button */}
                <div className="flex items-center justify-between gap-2.5 mt-4">
                  <NextUIButton
                    variant="bordered"
                    className="w-1 flex-grow rounded-3xl text-sm text-white border border-white border-opacity-50"
                    onClick={jumpToExplore}
                  >
                    View on {confirmInfo?.to}
                  </NextUIButton>
                  <NextUIButton
                    variant="bordered"
                    className="w-1 flex-grow rounded-3xl text-sm text-white border border-white border-opacity-50"
                    onClick={jumpToWormholeExplore}
                  >
                    View on Wormholescan
                  </NextUIButton>
                </div>
              </div>
              <NextUIButton
                variant="bordered"
                className="w-full mt-4 rounded border border-green-10 text-base text-green-10 font-bold"
                onClick={complete}
              >
                Transfer More Tokens
              </NextUIButton>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
function CheckBox({ checked }: { checked?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
        checked
          ? "border-green-40 bg-green-40"
          : "border-white border-opacity-25"
      }`}
    >
      {checked ? (
        <svg
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.44843 0.788883C9.84157 1.17677 9.84583 1.80992 9.45794 2.20306L3.81932 7.91809L0.540601 4.65428C0.149187 4.26465 0.147744 3.63148 0.537377 3.24007C0.92701 2.84866 1.56017 2.84721 1.95159 3.23685L3.80656 5.08338L8.03425 0.7984C8.42213 0.405257 9.05528 0.400996 9.44843 0.788883Z"
            fill="white"
          />
        </svg>
      ) : null}
    </div>
  );
}
