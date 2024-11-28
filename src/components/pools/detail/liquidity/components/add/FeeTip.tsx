import React from "react";

export function FeeTipV1() {
  return (
    <div className="border border-greenLight bg-primaryGreen bg-opacity-20 rounded-lg text-sm text-white px-3 py-2 my-3">
      👀 Fees automatically contribute to your liquidity for market making.
    </div>
  );
}
export function FeeTipDcl() {
  return (
    <div
      className="rounded text-sm text-white px-3 py-2 mt-4"
      style={{
        border: "1px solid rgba(154, 249, 1, 0.6)",
        background: "rgba(154, 249, 1, 0.1)",
      }}
    >
      {`👀 Claim your fees on the`} <span className="font-sans">"</span>Your
      Liquidity<span className="font-sans">"</span> {`page.`}
    </div>
  );
}
