import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const { nextui } = require("@nextui-org/react");
const getStyleMapping = (max: number, min: number) => {
  if (!max) {
    return;
  }
  const maxArray = [...Array(max + 1).keys()];
  return maxArray.reduce((pre, cur) => {
    // @ts-ignore
    cur >= min && (pre[cur] = `${cur / 4}rem`);
    return pre;
  }, {});
};
const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        SpaceGroteskBold: ["SpaceGroteskBold"],
      },
      colors: {
        chartsPink: "#657EFF",
        primaryDark: "#030F16",
        primaryGreen: "#9EFF00",
        poolTabBgOpacity15: "rgba(126, 138, 147, 0.15)",
        farmApyColor: "#FAFF00",
        farmTagBg: "rgba(250, 255, 0, 0.11)",
        error: "#FF4B76",
        warn: "#FFB018",
        modalGrayBg: "#1D2932",
        whiteOpacity: "rgba(255, 255, 255, 0.4)",
        v3feeTextColor: "#586F80",
        refPublicBoxDarkBg: "rgba(27, 36, 44, 0.4)",
        vaultTagBot: "#0057FF",
        gray: {
          10: "#91A2AE",
          20: "#212B35",
          30: "#1C252E",
          40: "#2A3643",
          50: "#6A7279",
          60: "#7E8A93",
          70: "#2D343D",
          80: "#8C9093",
          90: "#26323C",
          100: "#2B3843",
          110: "#AABAC7",
          120: "#4E5B6A",
          130: "#717E8D",
          140: "#414B57",
          150: "#AFB7BD",
          160: "#73818B",
          170: "#373F4A",
          180: "#7E8993",
          190: "#A7B8C8",
          200: "#1C272D",
          210: "#B9CAD6",
          220: "#353E49",
          230: "#243039",
          240: "#25313E",
          250: "#7D93A3",
          260: "#7E8A94",
          270: "#33485A",
          280: "#242F38",
          290: "#7B919D",
          300: "#3F505D",
          310: "#25303B",
          320: "#3B4B56",
        },
        dark: {
          10: "#1B242C",
          20: "#DFE4E8",
          30: "#030f16",
          40: "#2B343B",
          50: "#3A434D",
          60: "#141C22",
          70: "#101922",
          80: "#566069",
          45: "#16212A",
          90: "#273342",
          100: "#414E5D",
          110: "#424D56",
          120: "#001818",
          130: "#000F0F",
          140: "#0F1921",
          150: "#15202B",
          160: "#23313C",
          180: "#25313B",
          190: "#323E47",
          200: "#BCC9D2",
          210: "#0F1A22",
          220: "#0D1115",
          230: "#16232E",
          240: "#04121F",
          250: "#131F28",
          260: "#4C6171",
          270: "#121D26",
          280: "rgba(145, 162, 174, 0.2)",
          290: "#0C171F",
          300: "rgba(151, 151, 151, 0.2)",
          310: "#1F2935",
          320: "#1A252B",
        },
        green: {
          10: "#9EFE01",
          20: "#9AF901",
          30: "#00C6A2",
          40: "#32CA82"
        },
        lightWhite: {
          10: "#FFF2F2",
          20: "#F6FBFE",
        },
        red: {
          10: "#FF4B76",
          20: "#FF6A8E",
        },
        yellow: {
          10: "#E6B401",
          20: "#9DFE01",
          30: "#D2FF39",
        },
        purple: {
          10: "#A199FF",
          20: "#AA95FF",
        },
        blue: {
          10: "#01D0FE",
          20: "#3994FF",
        },
      },
      width: {
        ...getStyleMapping(300, 0),
        "95vw": "95vw",
      },
      minWidth: {
        ...getStyleMapping(100, 0),
      },
      maxWidth: {
        ...getStyleMapping(80, 0),
      },
      height: {
        ...getStyleMapping(300, 0),
      },
      minHeight: {
        ...getStyleMapping(150, 0),
      },
      maxHeight: {
        ...getStyleMapping(120, 0),
      },
      backgroundImage: (theme) => ({
        topLinearGradient: "linear-gradient( #FFDA19, #FF833E)",
        vaultTagLaunchpad:
          "linear-gradient(to right, rgba(0, 255, 209, 1), rgba(0, 148, 255, 1))",
        vaultTagLending:
          "linear-gradient(to right, rgba(255, 75, 118, 1), rgba(125, 45, 153, 1))",

        poolsTypelinearGrayBg:
          "linear-gradient(356.54deg, #2A3643 2.38%, #6A88A9 90.82%)",
        farmTitleBg:
          "linear-gradient(180deg, rgba(33, 43, 53, 0) 24.77%, rgba(33, 43, 53, 0.4) 124.77%)",
        farmTitleBtnBor:
          "linear-gradient(90deg, rgba(255, 247, 45, 0.3) 0%, rgba(158, 255, 0, 0.3) 100%)",
        greenGradient: "linear-gradient(90deg, #9EFF00 0%, #5F9900 100%)",
        greenGradientDark:
          "linear-gradient(90deg, #9DFD01 0%, #5F9900 110.34%)",
        farmItemBg:
          "radial-gradient(41.38% 60.79% at 30.24% -10.79%, rgba(250, 255, 0, 0.18) 0%, rgba(16, 32, 44, 0.3) 100%)",
        createPoolLinear: "linear-gradient(90deg, #9EFF00 1.39%, #5F9900 100%)",
        AddLiquidityBg: "linear-gradient(90deg, #8BE100 0%, #0099A3 100%)",
        textWhiteGradient: "linear-gradient(90deg, #FFFFFF 0%, #91A2AE 100%)",
        primaryGreenGradient:
          "linear-gradient(90deg, #9EFF00 -6.25%, #5F9900 100%)",
        memeCardGradient: "linear-gradient(180deg, #213441 0%, #15242F 100%)",
        farmMobileBgColor:
          "linear-gradient(95.38deg, #9EFF00 5.46%, #FAFF00 100%)",
        limitOrderMobileBg:
          "linear-gradient(180deg, #1B242C 0%, rgba(27, 36, 44, 0) 100%)",
        portfolioMobileBg:
          "linear-gradient(360deg, rgba(33, 43, 53, 0.5) 0%, rgba(61, 84, 108, 0.5) 100%)",
        yoursFarmBg:
          "radial-gradient(44.64% 80.05% at 30.82% 0%,rgba(250, 255, 0, 0.3) 0%,rgba(33, 43, 53, 0.09) 80.5%)",
        lightBlueBg: "linear-gradient(271.21deg, rgba(126, 138, 147, 0.1) -1.64%, rgba(0, 198, 162, 0.1) 99.16%);"
      }),
    },
    screens: {
      xs: { min: "300px", max: "600px" },
      sm: "769px",
      xsm: { min: "300px", max: "1024px" },
      md: { min: "600px", max: "1024px" },
      lg: { min: "1025px" },
      xl: { min: "1280px" },
      "2xl": { min: "1536px" },
      "3xl": { min: "1792px" },
      vxsm: { min: "300px", max: "767px" },
      vlg: { min: "768px" },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        ".poolBtnStyle": {
          // @apply frcc font-bold text-base text-black w-full h-11 rounded-md bg-greenGradient cursor-pointer
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
          fontSize: "16px",
          color: "#000",
          width: "100%",
          height: "44px",
          borderRadius: "6px",
          background: "linear-gradient(90deg, #9EFF00 0%, #5F9900 100%)",
        },
        ".poolBtnStyleBase": {
          // @apply frcc font-bold text-base text-black w-full h-11 rounded-md bg-greenGradient cursor-pointer
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
          color: "#000",
          borderRadius: "6px",
          background: "linear-gradient(90deg, #9EFF00 0%, #5F9900 100%)",
        },
        ".poolBtnStyleDefaultBase": {
          // @apply frcc font-bold text-base text-black w-full h-11 rounded-md bg-greenGradient cursor-pointer
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
          color: "#BCC9D2",
          borderRadius: "6px",
          background: "transparent",
          border: "1px solid #323E47",
        },
        ".poolBtnStyleDisable": {
          // @apply frcc font-bold text-base text-black w-full h-11 rounded-md bg-greenGradient cursor-pointer
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
          color: "#6A7279",
          borderRadius: "6px",
          background: "#2A3643",
          border: "1px solid #323E47",
        },
        ".poolBtnStyleActiveEmpty": {
          // @apply frcc font-bold text-base text-black w-full h-11 rounded-md bg-greenGradient cursor-pointer
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "700",
          color: "#9EFF00",
          border: "1px solid #9EFF00",
          borderRadius: "6px",
          background: "transparent",
        },
        ".frc": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        ".frcc": {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        },
        ".frcs": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        ".frsc": {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "start",
        },

        ".frcb": {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },

        ".fccc": {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        ".blur-2": {
          filter: "blur(2px)",
        },
      });
    }),
    nextui({
      dark: {
        colors: {
        }
      }
    }),
  ],
};
export default config;
