import React, { useRef, useEffect, useState } from "react";
import * as charts from "echarts";
import { toInternationalCurrencySystem_number } from "@/utils/uiNumber";
import { colorMap } from "@/utils/config";
import { toReadableNumber } from "@/utils/numbers";

function StablePoolRowCharts({
  legendJson,
  highlight,
  jsonMap,
  tokenPriceList,
}: {
  legendJson: any;
  highlight: any;
  jsonMap: any;
  tokenPriceList: any;
}) {
  const chartRef = useRef(null);
  const [chartsDataList, setChartDataList]: any = useState([]);
  useEffect(() => {
    const chartInstance = charts.init(chartRef.current);
    // deal data
    const waitSetList: any = [];
    jsonMap.amounts.map((item: any, index: number) => {
      waitSetList.push({
        // amount: Number(
        //   toReadableNumber(jsonMap.token_account_ids[index].decimals, item)
        // ),
        // name use as toInternationalCurrencySystem_number result
        name: toInternationalCurrencySystem_number(
          // item.substring(
          //   0,
          //   item.length - jsonMap.token_account_ids[index].decimals
          // )
          Number(
            toReadableNumber(jsonMap.token_account_ids[index].decimals, item)
          )
        ),
        value:
          (tokenPriceList[jsonMap.token_account_ids[index].tokenId]?.price ||
            0) *
          Number(
            toReadableNumber(jsonMap.token_account_ids[index].decimals, item)
          ),
        itemStyle: {
          color: colorMap[jsonMap.token_symbols[index]] || "black",
        },
      });
    });

    // const totalSum = chartsDataList.reduce((accumulator: number, next: any) => {
    //   return accumulator + next.value;
    // }, 0);
    setChartDataList(waitSetList);

    // charts option
    const options = {
      tooltip: {
        show: false,
      },
      animation: false,
      series: [
        {
          type: "pie",
          radius: ["60%", "80%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 10,
              color: "#fff",
              offset: [0, 0],
              align: "center",
              formatter: (params: any) => {
                const totalPrice = waitSetList.reduce(
                  (acc: number, curr: any) => acc + curr.value,
                  0
                );
                const pricePercentage = (
                  (params.data.value / totalPrice) *
                  100
                ).toFixed(2);
                return `$${toInternationalCurrencySystem_number(
                  params.data.value
                )}\n${pricePercentage}%`;
              },
            },
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            borderRadius: 1,
          },
          padAngle: 5,
          data: waitSetList,
        },
      ],
    };
    chartInstance.setOption(options);

    //add and remove hight disconnect
    if (highlight) {
      chartInstance.dispatchAction({
        type: "highlight",
        name: toInternationalCurrencySystem_number(
          // jsonMap.amounts[legendJson.ind].substring(
          //   0,
          //   jsonMap.amounts[legendJson.ind].length -
          //     jsonMap.token_account_ids[legendJson.ind].decimals
          // )
          Number(
            toReadableNumber(
              jsonMap.token_account_ids[legendJson.ind].decimals,
              jsonMap.amounts[legendJson.ind]
            )
          )
        ),
      });
    } else {
      chartInstance.dispatchAction({
        type: "downplay",
      });
    }

    // clear
    return () => {
      chartInstance.dispose();
    };
  }, [highlight]);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100px",
        height: "82px",
      }}
    ></div>
  );
}

export default React.memo(StablePoolRowCharts);
