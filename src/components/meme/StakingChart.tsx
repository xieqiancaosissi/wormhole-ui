import React, { useContext, useMemo, useState, useEffect } from "react";
// @ts-ignore
import PropTypes from "prop-types";
// @ts-ignore
import { PieChart, Pie, Sector, Cell } from "recharts";
import Big from "big.js";
import { MemeContext } from "./context";
import { getMemeDataConfig, getMemeContractConfig } from "./memeConfig";
import { emptyObject } from "./tool";
import { toReadableNumber } from "../../utils/numbers";
import {
  formatPercentage,
  toInternationalCurrencySystem_number,
  toInternationalCurrencySystem_usd,
} from "../../utils/uiNumber";
import { Seed } from "../..//services/farm";
import { isMobile } from "@/utils/device";

const is_mobile = isMobile();
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="transparent"
        strokeWidth={0}
      />
    </g>
  );
};

const StakingChart: React.FC<{ chartType: string }> = ({ chartType }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { seeds, xrefSeeds, allTokenMetadatas } = useContext(MemeContext)!;
  const { MEME_TOKEN_XREF_MAP } = getMemeContractConfig();
  const memeDataConfig = getMemeDataConfig();
  const { coming_offline_soon_token } = getMemeDataConfig();
  const meme_winner_tokens = memeDataConfig.meme_winner_tokens;
  const displaySeeds = useMemo(() => {
    if (!seeds || emptyObject(seeds)) return {};
    return meme_winner_tokens.reduce(
      (acc: any, memeTokenId: string | number) => ({
        ...acc,
        ...{ [memeTokenId]: seeds[memeTokenId] },
      }),
      {}
    ) as Record<string, Seed>;
    // return Object.entries(MEME_TOKEN_XREF_MAP).reduce((acc, [memeTokenId]) => {
    //   const seed = seeds[memeTokenId];
    //   if (seed && !coming_offline_soon_token.includes(memeTokenId)) {
    //     return {
    //       ...acc,
    //       [memeTokenId]: seed,
    //     };
    //   }
    //   return acc;
    // }, {} as Record<string, Seed>);
  }, [seeds]);

  const chartData = useMemo(() => {
    if (
      emptyObject(displaySeeds) ||
      emptyObject(xrefSeeds) ||
      !allTokenMetadatas
    ) {
      return [];
    }

    const { pie_color } = getMemeDataConfig();
    let totalTvl = Big(0);
    let totalTvlForCalculation = chartType === "meme" ? Big(0) : Big(0);
    const dataItems: {
      seed_id: string;
      seedTvl: string;
      xrefSeedTvl: string;
      amount: Big.Big;
      symbol: string;
      icon: string;
      color: any;
    }[] = [];

    Object.keys(displaySeeds).forEach((seed_id) => {
      const seed = displaySeeds[seed_id];
      const xrefSeed = xrefSeeds[MEME_TOKEN_XREF_MAP[seed_id]];
      if (seed && xrefSeed && seed.seedTvl && xrefSeed.seedTvl) {
        const seedTvl = Big(seed.seedTvl);
        const seedAmount = toReadableNumber(
          seed.seed_decimal,
          seed.total_seed_amount
        );
        const xrefSeedTvl = Big(xrefSeed.seedTvl);
        const xrefSeedAmount = toReadableNumber(
          xrefSeed.seed_decimal,
          xrefSeed.total_seed_amount
        );

        if (chartType === "meme") {
          totalTvl = totalTvl.plus(seedTvl);
          totalTvlForCalculation = totalTvl;
        } else if (chartType === "xref") {
          totalTvl = totalTvl.plus(xrefSeedTvl);
          totalTvlForCalculation = totalTvl;
        }

        dataItems.push({
          seed_id,
          seedTvl: seedTvl.toFixed(),
          xrefSeedTvl: xrefSeedTvl.toFixed(),
          amount: chartType === "meme" ? Big(seedAmount) : Big(xrefSeedAmount),
          symbol: allTokenMetadatas[seed_id]?.symbol,
          icon: allTokenMetadatas[seed_id]?.icon,
          color: pie_color[seed_id],
        });
      }
    });

    const MIN_DISPLAY_PERCENT = 1;

    const adjustedDataItems = dataItems
      .map((item) => {
        const value =
          chartType === "meme" ? Big(item.seedTvl) : Big(item.xrefSeedTvl);
        const percent = totalTvlForCalculation.gt(0)
          ? value.div(totalTvlForCalculation).mul(100).toFixed(2)
          : 0;
        const displayPercent = Number(percent) < 0.01 ? "<0.01" : percent;
        return {
          ...item,
          value: Number(percent),
          displayValue: Math.max(Number(percent), MIN_DISPLAY_PERCENT),
          percent: displayPercent,
        };
      })
      // .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    return adjustedDataItems;
  }, [displaySeeds, xrefSeeds, allTokenMetadatas, chartType]);

  const onPieEnter = (_: any, index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(0);
  };

  const renderCenteredText = (data: string | any[], activeIndex: number) => {
    if (activeIndex < 0 || activeIndex >= data.length) return null;
    const activeEntry = data[activeIndex];
    const centerX = 320 / 2;
    const imageSize = 44;
    const imageX = centerX - imageSize / 2;
    const imageY = 80;

    return (
      <>
        <defs>
          <clipPath id="roundedImage">
            <circle
              cx={centerX}
              cy={imageY + imageSize / 2}
              r={imageSize / 2}
            />
          </clipPath>
        </defs>
        <image
          x={imageX}
          y={imageY}
          width={imageSize}
          height={imageSize}
          href={activeEntry.icon}
          clipPath="url(#roundedImage)"
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fill: "white",
            fontSize: "16px",
          }}
        >
          {activeEntry.symbol}
        </text>
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fill: "white",
            fontSize: "38px",
            fontWeight: "700",
          }}
        >
          {activeEntry.percent}%
        </text>
        <text
          x="50%"
          y="76%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: "white", fontSize: "16px" }}
        >
          {chartType === "xref"
            ? toInternationalCurrencySystem_number(activeEntry.amount) + " xREF"
            : toInternationalCurrencySystem_number(activeEntry.amount)}
        </text>
      </>
    );
  };

  const customActiveShape = (props: any) => {
    // eslint-disable-next-line react/prop-types
    if (props.index === activeIndex) {
      return renderActiveShape({
        ...props,
        // eslint-disable-next-line react/prop-types
        outerRadius: props.outerRadius + 5,
      });
    }
    return renderActiveShape(props);
  };

  if (chartData.length === 0) return null;
  return (
    <div className="flex justify-center">
      <PieChart width={is_mobile ? 320 : 320} height={is_mobile ? 320 : 320}>
        <Pie
          activeIndex={activeIndex}
          activeShape={customActiveShape}
          data={chartData}
          dataKey="displayValue"
          nameKey="symbol"
          cx="50%"
          cy="50%"
          innerRadius={is_mobile ? 120 : 120}
          outerRadius={is_mobile ? 146 : 146}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          stroke={is_mobile ? "#192a35" : "#00121f"}
          strokeWidth={2}
          paddingAngle={1}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${entry.seed_id}-${index}`}
              fill={entry.color}
              stroke={is_mobile ? "#192a35" : "#00121f"}
              strokeWidth={2}
            />
          ))}
        </Pie>
        {activeIndex !== -1 && renderCenteredText(chartData, activeIndex)}
      </PieChart>
    </div>
  );
};

StakingChart.propTypes = {
  chartType: PropTypes.oneOf(["meme", "xref"]).isRequired,
};

export default React.memo(StakingChart);
