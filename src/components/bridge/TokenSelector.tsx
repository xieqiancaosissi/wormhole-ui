import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import Modal from "react-modal";

import Button from "./Button";
import SvgIcon from "./SvgIcon";
import { useRequest } from "@/hooks/useHooks";
import { formatChainIcon, formatChainName, formatNumber } from "@/utils/format";
import { tokenServices } from "@/services/bridge/contract";
import { getTokenMeta } from "@/utils/token";
import { BridgeTokenSortRule } from "@/config/bridge";
import { Image } from "@nextui-org/react";

export type TokenSelectorCommonProps = {
  chain: BridgeModel.BridgeSupportChain;
  value?: BridgeModel.IBridgeTokenMeta;
  tokens: BridgeModel.IBridgeTokenMeta[];
  selectableAddresses?: string[];
  disabled?: boolean;
  onChange?: (v: BridgeModel.IBridgeTokenMeta) => void;
};

export function TokenSelector({
  value,
  tokens,
  chain,
  placeholder,
  disabled,
  onChange,
  selectableAddresses,
}: Partial<TokenSelectorCommonProps & { placeholder?: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);
  function handleToggle() {
    setIsOpen(!isOpen);
  }
  // const displayValue = useMemo(() => {
  //   return formatChainToken(chain, value);
  // }, [value]);
  const displayValue = value;
  return (
    <>
      <Button
        disabled={!tokens.length || disabled}
        className="!border-0"
        rounded
        onClick={handleToggle}
      >
        {value ? (
          <>
            <Image
              classNames={{ wrapper: "w-6 h-6 rounded-full mr-2" }}
              src={displayValue.icon}
              width={24}
              height={24}
            />
            <span className="text-white mr-2 text-base">
              {displayValue.symbol}
            </span>
          </>
        ) : (
          placeholder ?? <span className="text-white mr-2">Select token</span>
        )}
        {!disabled && tokens.length > 0 && (
          <SvgIcon name="IconArrowDown" className="!text-xs" />
        )}
      </Button>
      {isOpen && tokens.length && (
        <TokenSelectorModal
          isOpen={isOpen}
          value={value}
          chain={chain}
          selectableAddresses={selectableAddresses}
          tokens={tokens}
          toggleOpenModal={handleToggle}
          onSelected={onChange}
        />
      )}
    </>
  );
}

export interface TokenSelectorProps
  extends Modal.Props,
    TokenSelectorCommonProps {
  toggleOpenModal: () => void;
  onSelected?: (v: BridgeModel.IBridgeTokenMeta) => void;
  onCancel?: () => void;
}
export function TokenSelectorModal({
  toggleOpenModal,
  chain,
  value,
  tokens,
  selectableAddresses,
  ...props
}: TokenSelectorProps) {
  const [tokenFilter, setTokenFilter] = useState<{
    text: string;
    chain: BridgeModel.BridgeSupportChain;
  }>({ text: "", chain });
  useEffect(() => {
    setTokenFilter({ text: tokenFilter.text, chain });
  }, [chain, tokenFilter.text]);

  const tokenList = useMemo(() => {
    const _tokens = tokens.sort((a, b) => {
      return (
        selectableAddresses?.indexOf(b.address) -
        selectableAddresses?.indexOf(a.address)
      );
    });
    const text = tokenFilter.text;
    if (!text) return _tokens;
    return (
      _tokens.filter((item) => {
        return (
          item.address?.toLowerCase() == text.toLowerCase() ||
          item.symbol?.toLowerCase().includes(text.toLowerCase())
          // item.name?.toLowerCase().includes(text.toLowerCase())
        );
      }) || []
    );
  }, [tokenFilter.chain, tokenFilter.text, tokens]);

  const { data: balanceMap, loading } = useRequest(async () => {
    const res = await Promise.allSettled(
      tokenList.map((v) => tokenServices.getBalance(chain, v))
    );
    return res.reduce((acc, item, index) => {
      if (item.status === "fulfilled") {
        acc[tokenList[index].symbol] = item.value;
      }
      return acc;
    }, {} as Record<string, string>);
  });

  function handleSelected(item: BridgeModel.IBridgeTokenMeta) {
    props.onSelected?.(item);
    toggleOpenModal();
  }

  function handleCancel() {
    props.onCancel?.();
    toggleOpenModal();
  }

  return (
    <Modal
      {...props}
      overlayClassName="modal-overlay"
      onRequestClose={handleCancel}
    >
      <div className="bridge-modal" style={{ width: "428px" }}>
        <div className="flex items-center justify-between">
          <span className="text-base text-white font-medium">
            Select a token
          </span>
          <Button text onClick={handleCancel}>
            <SvgIcon name="IconClose" />
          </Button>
        </div>
        <div className="my-3">
          <div className="relative">
            <SvgIcon
              name="IconSearch"
              className="absolute left-3 top-1/2 -mt-2"
            />
            <input
              className="bridge-input"
              style={{ paddingLeft: "2.2rem" }}
              value={tokenFilter.text}
              placeholder="Search name or paste address"
              onChange={(e) =>
                setTokenFilter({ ...tokenFilter, text: e.target.value })
              }
            />
          </div>
        </div>
        <div className="relative">
          {loading && (
            <SvgIcon
              name="IconLoading"
              className="text-gray-400 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            />
          )}
          <div>
            {tokenList.map((item) => {
              const disbaled = selectableAddresses?.indexOf(item.address) == -1;
              return (
                item.symbol && (
                  <TokenSelectorItem
                    key={tokenFilter.chain + item.symbol}
                    isSelect={value?.symbol === item.symbol}
                    chain={tokenFilter.chain}
                    token={item}
                    disabled={disbaled}
                    balance={balanceMap?.[item.symbol]}
                    onClick={() => {
                      if (!disbaled) {
                        handleSelected(item);
                      }
                    }}
                  />
                )
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function TokenSelectorItem({
  isSelect,
  chain,
  token,
  balance,
  onClick,
  disabled,
}: {
  isSelect?: boolean;
  chain: BridgeModel.BridgeSupportChain;
  token: BridgeModel.IBridgeTokenMeta;
  disabled: boolean;
  balance?: string;
  onClick?: MouseEventHandler;
}) {
  const displayToken = token;

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 -mx-4 ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer hover:bg-white hover:bg-opacity-10"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-9 h-9 relative mr-3">
          <Image
            src={displayToken.icon}
            width={36}
            height={36}
            classNames={{ wrapper: "w-9 h-9 rounded-full" }}
            alt=""
          />
          <Image
            src={formatChainIcon(chain)}
            width={14}
            height={14}
            alt=""
            classNames={{ wrapper: "absolute right-0 bottom-0 w-3.5 h-3.5" }}
          />
        </div>
        <div>
          <div className="text-base text-white mb-1">{displayToken.symbol}</div>
          <div className="text-xs">{formatChainName(chain)}</div>
        </div>
      </div>
      <div className="text-white text-opacity-50">
        <div className="text-right mb-1">
          {isSelect && (
            <SvgIcon
              name="IconSuccess"
              className="inline-block mr-2 text-primary"
            />
          )}
          <span
            className="inline-flex justify-end text-white text-sm text-right"
            style={{ minWidth: "3rem" }}
          >
            {formatNumber(balance)}
          </span>
        </div>
      </div>
    </div>
  );
}
