import React, { useEffect, useState } from "react";
import { UserLiquidityInfo } from "@/services/commonV3";

import { RemovePoolV3 } from "./RemovePoolV3";

export function SelectLiquidityBox(props: any) {
  const {
    isOpen,
    onRequestClose,
    poolDetail,
    operation,
    tokenPriceList,
    user_liquidities,
    setAddSuccess,
  } = props;

  const [hoverHashId, setHoverHashId] = useState("");
  const { token_x_metadata, token_y_metadata } = poolDetail;
  function getCurrentLiqudity(hashId: string) {
    const c_l = user_liquidities.find((liquidity: UserLiquidityInfo | any) => {
      if (liquidity.lpt_id.split("#")[1] == hashId) return true;
    });
    return c_l;
  }
  return operation == "remove" && isOpen ? (
    <RemovePoolV3
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      listLiquidities={user_liquidities}
      tokenMetadata_x_y={[token_x_metadata, token_y_metadata]}
      poolDetail={poolDetail}
      tokenPriceList={tokenPriceList}
      userLiquidity={getCurrentLiqudity(hoverHashId)}
      setAddSuccess={setAddSuccess}
      style={{
        overlay: {
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
        },
        content: {
          outline: "none",
          transform: "translate(-50%, -50%)",
        },
      }}
    />
  ) : null;
}
