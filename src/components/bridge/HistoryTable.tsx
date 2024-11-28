import React, { useMemo } from "react";
import SvgIcon from "./SvgIcon";
import {
  formatAmount,
  formatChainIcon,
  formatSortAddress,
  formatTimestamp,
  formatTxExplorerUrl,
} from "@/utils/format";
import { getTokenByAddress, getTokenDecimals } from "@/utils/token";
import CustomTooltip from "@/components/customTooltip/customTooltip";
import { Image } from "@nextui-org/react";

const columns = [
  { label: "Time", prop: "time", width: "15%" },
  { label: "Direction", prop: "direction", width: "15%" },
  { label: "Amount In", prop: "amount", width: "15%" },
  { label: "Sending address(Tx)", prop: "sendingAddr", width: "20%" },
  { label: "Receiving address(Tx)", prop: "receivingAddr", width: "20%" },
  { label: "Amount Out", prop: "to_near", width: "20%" },
  { label: "Status", prop: "status", width: "15%" },
];

function TableItem({
  item: transaction,
  onRefresh,
}: {
  item: BridgeModel.BridgeHistory;
  onRefresh?: () => void;
}) {
  const tokenMeta = useMemo(
    () => getTokenByAddress(transaction.token, transaction.from_chain),
    [transaction.token, transaction.from_chain]
  );

  // const { callAction, actionLoading } = useBridge();
  // async function handleAction() {
  //   await callAction(transaction.id);
  //   onRefresh();
  // }
  return (
    <tr>
      <td>{formatTimestamp(transaction.created_time)}</td>
      <td>
        <div className="flex items-center w-full gap-2">
          <Image
            src={formatChainIcon(transaction.from_chain)}
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <SvgIcon name="IconDirection" />
          <Image
            src={formatChainIcon(transaction.to_chain)}
            width={28}
            height={28}
            className="w-7 h-7"
          />
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <span
            className="flex-shrink-0"
            data-tooltip-id="token-symbol"
            data-place="top"
            data-class="reactTip"
            data-tooltip-html={tokenMeta?.symbol}
          >
            <Image
              src={tokenMeta?.icon}
              width={20}
              height={20}
              classNames={{ wrapper: "w-5 h-5 rounded-full" }}
            />

            <CustomTooltip id="token-symbol" />
          </span>
          {formatAmount(
            transaction.volume,
            getTokenDecimals(tokenMeta.symbol, transaction.from_chain)
          )}
        </div>
      </td>
      <td>
        <div>{formatSortAddress(transaction.from)}</div>
        <a
          href={formatTxExplorerUrl(
            transaction.from_chain,
            transaction.from_chain_hash
          )}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#99B0FF" }}
          className="hover:underline"
        >
          {formatSortAddress(transaction.from_chain_hash)}
        </a>
      </td>
      <td>
        <div>{formatSortAddress(transaction.to)}</div>
        <a
          href={formatTxExplorerUrl(
            transaction.to_chain,
            transaction.to_chain_hash
          )}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#99B0FF" }}
          className="hover:underline"
        >
          {formatSortAddress(transaction.to_chain_hash)}
        </a>
      </td>
      <td>
        <div className="flex flex-col">
          {transaction.to_usdc ? (
            <span className="text-left">{transaction.to_usdc} USDC</span>
          ) : null}
          {transaction.to_near ? (
            <span className="text-left">{transaction.to_near} NEAR</span>
          ) : null}
          {!transaction.to_usdc && !transaction.to_near
            ? formatAmount(
                transaction.amount,
                getTokenDecimals(tokenMeta.symbol, transaction.from_chain)
              ) + " USDC"
            : null}
        </div>
      </td>
      <td>
        <div className="flex items-center">
          {transaction.status === "DELIVERED" ? (
            <>
              <SvgIcon
                name="IconSuccess"
                className="text-primary text-sm mr-2"
              />
              Completed
            </>
          ) : (
            <>Pending</>
          )}
        </div>
        {/* {transaction.status === 'action-needed' && transaction.callToAction ? (
          <Button
            loading={actionLoading}
            type="primary"
            size="small"
            onClick={handleAction}
          >
            {transaction.callToAction}
          </Button>
        ) : (
          <div className="flex items-center">
            {transaction.status === 'completed' && (
              <SvgIcon
                name="IconSuccess"
                className="text-primary text-sm mr-2"
              />
            )}
            {transaction.status}
          </div>
        )} */}
      </td>
    </tr>
  );
}

type Props = {
  data?: BridgeModel.BridgeHistory[];
  loading?: boolean;
  onRefresh?: () => void;
};
function HistoryTable({ data, loading, onRefresh }: Props) {
  return (
    <div
      className="relative overflow-auto"
      style={{
        minHeight: "calc(100vh - 500px)",
        maxHeight: "calc(100vh - 420px)",
      }}
    >
      {loading && (
        <div className="absolute left-0 top-0 right-0 bottom-0  z-1 flex items-center justify-center">
          <SvgIcon name="IconLoading" className="text-6xl" />
        </div>
      )}
      <table className="bridge-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.prop} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length
            ? data?.map((item, index) => (
                <TableItem
                  key={index}
                  item={item}
                  onRefresh={onRefresh}
                ></TableItem>
              ))
            : !loading && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center p-10 gap-3 text-gray-400">
                      <SvgIcon name="IconEmpty" className="text-4xl" />
                      No result
                    </div>
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;
