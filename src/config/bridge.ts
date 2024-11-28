import erc20Abi from "@/services/bridge/abi/erc20.json";
import erc20LockerAbi from "@/services/bridge/abi/erc20Locker.json";
import nearOnEthClientAbi from "@/services/bridge/abi/nearOnEthClient.json";
import auroraErc20Abi from "@/services/bridge/abi/auroraErc20.json";
import etherCustodianAbi from "@/services/bridge/abi/etherCustodian.json";
import eNEARAbi from "@/services/bridge/abi/eNEAR.json";
import StargatePoolUSDCAbi from "@/services/bridge/abi/stargatePoolUSDC.json";
import StargateOFTUSDCAbi from "@/services/bridge/abi/stargateOFTUSDC.json";
import { formatFileUrl } from "@/utils/format";
import BridgeTokenRoutes from "./bridgeRoutes";

export const APPID = "ref-finance";
export const APP_HOST = "https://old.app.ref.finance";

export const IS_MAINNET = !["testnet", "pub-testnet"].includes(
  process.env.NEXT_PUBLIC_NEAR_ENV
);
export const IS_TESTNET = ["testnet", "pub-testnet"].includes(
  process.env.NEXT_PUBLIC_NEAR_ENV
);

const INFURA_KEY = "45ad2962c1b5465bb6fe62db0d35b42f";

export const EVMConfig: {
  chains: Record<
    string,
    {
      network: string;
      infuraKey: string;
      explorerUrl: string;
      chainId: number;
      whChainId?: number;
      id: string;
      token: string;
      label: string;
      rpcUrl: string;
    }
  >;
  walletConnectProjectId: string;
} = {
  chains: {
    arbitrum: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://arbiscan.io",
      chainId: 42161,
      whChainId: 23,
      id: "0xA4B1",
      token: "ETH",
      label: "Arbitrum",
      rpcUrl: "https://rpc.ankr.com/arbitrum",
    },
    aurora: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://explorer.aurora.dev",
      chainId: 1313161554,
      id: "0x4e454152",
      token: "ETH",
      label: "Aurora",
      rpcUrl: "https://mainnet.aurora.dev",
    },
    avalanche: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://cchain.explorer.avax.network",
      chainId: 43114,
      whChainId: 6,
      id: "0xa86a",
      token: "AVAX",
      label: "Avalanche",
      rpcUrl: "https://avalanche.drpc.org",
    },
    base: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://explorer.base.org",
      chainId: 8453,
      whChainId: 30,
      id: "0x2105",
      token: "ETH",
      label: "Base",
      rpcUrl: "https://mainnet.base.org",
    },
    ethereum: {
      network: IS_MAINNET ? "mainnet" : "sepolia",
      infuraKey: INFURA_KEY,
      explorerUrl: IS_MAINNET
        ? "https://etherscan.io"
        : "https://sepolia.etherscan.io",
      chainId: IS_MAINNET ? 1 : 11155111,
      whChainId: 2,
      id: "0x1",
      token: "ETH",
      label: `Ethereum`,
      rpcUrl: IS_MAINNET
        ? "https://eth.drpc.org/"
        : `https://testnet.infura.io/v3/${INFURA_KEY}`,
    },
    flare: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://flare-explorer.flare.network",
      chainId: 14,
      id: "0xe",
      token: "FLR",
      label: "Flare",
      rpcUrl: "https://flare-api.flare.network/ext/C/rpc",
    },
    mantle: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://explorer.mantle.xyz",
      chainId: 5000,
      id: "0x1388",
      token: "MNT",
      label: "Mantle",
      rpcUrl: "https://rpc.mantle.xyz/",
    },
    optimism: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://optimistic.etherscan.io",
      chainId: 10,
      whChainId: 24,
      id: "0xa",
      token: "ETH",
      label: "Optimism",
      rpcUrl: "https://mainnet.optimism.io",
    },
    polygon: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://polygonscan.com",
      chainId: 137,
      whChainId: 5,
      id: "0x89",
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://polygon.drpc.org",
    },
    scroll: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://scrollscan.com",
      chainId: 534352,
      id: "0x82750",
      token: "ETH",
      label: "Scroll",
      rpcUrl: "https://rpc.ankr.com/scroll",
    },
    sei: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://seitrace.com",
      chainId: 1329,
      whChainId: 32,
      id: "0x531",
      token: "SEI",
      label: "SEI",
      rpcUrl: "https://evm-rpc.sei-apis.com",
    },
    taiko: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://taikoscan.io",
      chainId: 167000,
      id: "0x28c58",
      token: "ETH",
      label: "TAIKO",
      rpcUrl: "https://rpc.taiko.xyz",
    },
    bsc: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://bscscan.com",
      chainId: 56,
      whChainId: 4,
      id: "0x38",
      token: "BNB",
      label: "BNB Smart Chain",
      rpcUrl: "https://bsc-pokt.nodies.app",
    },
    gravity: {
      network: "mainnet",
      infuraKey: INFURA_KEY,
      explorerUrl: "https://explorer.gravity.xyz",
      chainId: 1625,
      id: "0x659",
      token: "G",
      label: "Gravity",
      rpcUrl: "https://rpc.gravity.xyz",
    },
  },

  walletConnectProjectId: "669d1b9f59163a92d90a3c1ff78a7326",
};

export const NearConfig = {
  explorerUrl: IS_MAINNET
    ? "https://nearblocks.io"
    : "https://testnet.nearblocks.io",
};

const RainbowBridgeDefaultParams = {
  nearEventRelayerMargin: 10, // blocks
  sendToNearSyncInterval: 60000, // check light client sync interval (ms)
  sendToEthereumSyncInterval: 60000, // check light client sync interval (ms)
  maxFindEthProofInterval: 600000, // check finalization status max interval (ms)
  erc20Abi,
  erc20LockerAbi,
  ethClientAbi: nearOnEthClientAbi,
  auroraErc20Abi,
  etherCustodianAbi,
  auroraEvmAccount: "aurora",
  auroraRelayerAccount: "relay.aurora",
  etherExitToEthereumPrecompile: "0xb0bD02F6a392aF548bDf1CfAeE5dFa0EefcC8EaB",
  etherExitToNearPrecompile: "0xE9217BC70B7ED1f598ddD3199e80b093fA71124F",
  eNEARAbi,
  ethChainId: EVMConfig.chains.ethereum.chainId,
};
export const BridgeConfig: Record<
  BridgeModel.BridgeSupportChannel,
  {
    estimateWaitText?: string;
    bridgeParams?: Record<string, any>;
    estimateWaitTextFromNear?: string;
    estimateWaitTextFromEvm?: string;
  }
> = {
  Rainbow: {
    estimateWaitText: "~20 mins",
    bridgeParams: IS_MAINNET
      ? {
          ...RainbowBridgeDefaultParams,
          auroraChainId: 1313161554,
          erc20LockerAddress: "0x23ddd3e3692d1861ed57ede224608875809e127f",
          nep141Factory: "factory.bridge.near",
          etherCustodianAddress: "0x6BFaD42cFC4EfC96f529D786D643Ff4A8B89FA52",
          ethClientAddress: "0x0151568af92125fb289f1dd81d9d8f7484efc362",
          nearClientAccount: "client.bridge.near",
          eNEARAddress: "0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4",
          nativeNEARLockerAddress: "e-near.near",
          wNearNep141: "wrap.near",
          eventRelayerAccount: "event-relayer.near",
        }
      : {
          ...RainbowBridgeDefaultParams,
          auroraChainId: 1313161555,
          erc20LockerAddress: "0xC115851CA60Aed2CCc6EE3D5343F590834e4a3aB",
          nep141Factory: "factory.goerli.testnet",
          etherCustodianAddress: "0x84a82Bb39c83989D5Dc07e1310281923D2544dC2",
          ethClientAddress: "0x37C2d89b55Bfd95532637554711441017eFabFef",
          nearClientAccount: "client-eth2.goerli.testnet",
          eNEARAddress: "0xe6b7C088Da1c2BfCf84aaE03fd6DE3C4f28629dA",
          nativeNEARLockerAddress: "enear.goerli.testnet",
          wNearNep141: "wrap.testnet",
          eventRelayerAccount: "event-relayer.goerli.testnet",
        },
  },
  Stargate: {
    estimateWaitText: "1~3 mins",
    bridgeParams: {
      Arbitrum: {
        send: "0xa44011014805740598c54F71964E721D7B481612",
        pool: {
          USDC: "0xe8CDF27AcD73a434D661C84887215F7598e7d0d3",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30110",
      },
      Ethereum: {
        send: "0x109eB1D532dB1dAe2981233ebB419faF08CD2106",
        pool: {
          USDC: "0xc026395860Db2d07ee33e05fE50ed7bD583189C7",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30101",
      },
      Aurora: {
        send: "",
        receive: "0xD5a9F703add862D4E28AA03C951eC6535c9F47eF",
        pool: {
          USDC: "0x81F6138153d473E8c5EcebD3DC8Cd4903506B075",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30211",
      },
      Avalanche: {
        send: "0x2fAF8550fD1Ec4212CdabE8988B54321fb0c0018",
        pool: {
          USDC: "0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30106",
      },
      Base: {
        send: "0x19aCfC9Aa22Bf1454f94d06696A06D0AB56D5de6",
        pool: {
          USDC: "0x27a16dc786820B16E5c9028b75B99F6f604b5d26",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30184",
      },
      Mantle: {
        send: "0x5149434074bC009C8269376390ca722a552A8F47",
        pool: {
          USDC: "0xAc290Ad4e0c891FDc295ca4F0a6214cf6dC6acDC",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30181",
      },
      Optimism: {
        send: "0x23fF74a267defbd14a943e4CAEA250f1f0795510",
        pool: {
          USDC: "0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30111",
      },
      Polygon: {
        send: "0x8cE17C7A6E7c53EbD8919D7C6E54a68BA3D1d3Ad",
        pool: {
          USDC: "0x9Aa02D4Fae7F58b8E8f34c66E756cC734DAc7fe4",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30109",
      },
      Scroll: {
        send: "0xbD030aefc72370Bd2db5748E592Aa45761ead6Ff",
        pool: {
          USDC: "0x3Fc69CC4A842838bCDC9499178740226062b14E4",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30214",
      },
      SEI: {
        send: "0xF31AE76d71E3f7a16563E03b6D02ECD5caF48882",
        pool: {
          USDC: "0x45d417612e177672958dC0537C45a8f8d754Ac2E",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30280",
      },
      TAIKO: {
        send: "0xF31AE76d71E3f7a16563E03b6D02ECD5caF48882",
        oft: {
          USDC: "0x77C71633C34C3784ede189d74223122422492a0f",
          USDCABI: StargateOFTUSDCAbi,
        },
        eid: "30290",
      },
      Flare: {
        send: "0xF31AE76d71E3f7a16563E03b6D02ECD5caF48882",
        oft: {
          USDC: "0x77C71633C34C3784ede189d74223122422492a0f",
          USDCABI: StargateOFTUSDCAbi,
        },
        eid: "30295",
      },
      BSC: {
        send: "0x4F0AdAcc34367cb4B6AcEB73D8BBC936eC0aC06e",
        pool: {
          USDC: "0x962Bd449E630b0d928f308Ce63f1A21F02576057",
          USDCABI: StargatePoolUSDCAbi,
        },
        eid: "30102",
      },
      Gravity: {
        send: "0xCa55792349964b4F55af6D679684283304f0f596",
        pool: {
          USDC: "0xC1B8045A6ef2934Cf0f78B0dbD489969Fa9Be7E4",
          USDCABI: StargateOFTUSDCAbi,
        },
        eid: "30294",
      },
      EndpointV2: "0x1a44076050125825900e736c501f859c50fE728c",
    },
  },
  Wormhole: {
    estimateWaitTextFromNear: "1~3 mins",
    estimateWaitTextFromEvm: "~25 mins",
  },
} as const;

export const BridgeTokenSortRule = [
  "USDC",
  "USDT.e",
  "USDC.e",
  "NEAR",
  "ETH",
  "WBTC",
  "DAI",
  "OCT",
  "WOO",
];

export const SupportChains = BridgeTokenRoutes.reduce((acc, v) => {
  if (!acc.includes(v.from)) acc.push(v.from);
  if (!acc.includes(v.to)) acc.push(v.to);
  return acc;
}, [] as BridgeModel.BridgeSupportChain[]).sort((a, b) => {
  if (a === "NEAR") return -1;
  if (b === "NEAR") return 1;
  return a.localeCompare(b);
});
export const uniswapV2Router02ContractAddress =
  "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B";
export const uniswapV2Router02SwapPath = [
  "0x368ebb46aca6b8d0787c96b2b20bd3cc3f2c45f7",
  "0x8bec47865ade3b172a928df8f990bc7f2a3b9f79",
  "0xc42c30ac6cc15fac9bd938618bcaa1a1fae8501d",
];
export const minSwapAmountInUniswapV2Router02 = "2";
export const maxSwapAmountInUniswapV2Router02 = "100";
export const defaulSwapFee = 30;
export const defaultBridgeFee = 0;
