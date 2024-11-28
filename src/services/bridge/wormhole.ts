import Big from "big.js";
import { executeMultipleTransactions, ONE_YOCTO_NEAR } from "@/utils/near";
import { Transaction } from "@/services/xref";
import { addressFormatEVM } from "@/utils/bridgeUtils";
import { viewFunction } from "@/utils/near";
import {
  parseSequenceFromLogNear,
  getIsWrappedAssetNear,
} from "@/utils/bridgeUtils";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";
import { getSignedVAAWithRetry } from "@/services/bridge/utils/near";
import {
  CHAIN_ID_NEAR,
  uint8ArrayToHex,
  transferFromEth,
  transferFromEthNative,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  redeemOnEth,
  redeemOnEthNative,
  ChainId,
  hexToUint8Array,
  getAllowanceEth,
  approveEth,
} from "@certusone/wormhole-sdk";
import { _parseVAAAlgorand } from "@certusone/wormhole-sdk/lib/esm/algorand";
import {
  getForeignAssetNear,
  getTokenBridgeAddressForChain,
  getBridgeAddressForChain,
} from "@/services/bridge/utils/near";
import { Signer, ContractReceipt, BigNumber } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { getEmitterAddressNear } from "@/utils/bridgeUtils";
import { EVMConfig } from "@/config/bridge";
import { getNear } from "@/utils/near";
import { toNonDivisibleNumber, toReadableNumber } from "@/utils/numbers";
import { getAccountId } from "@/utils/wallet";
const WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID =
  getTokenBridgeAddressForChain(CHAIN_ID_NEAR);
const WORMHOLE_CORE_CONTRACT_ID = getBridgeAddressForChain(CHAIN_ID_NEAR);
const wormholeBridgeService = {
  async transferNearFromNear({
    receiver,
    chainId,
    amount,
  }: {
    receiver: string;
    chainId: number;
    amount: string;
  }) {
    const message_fee = await viewFunction({
      contractId: WORMHOLE_CORE_CONTRACT_ID,
      methodName: "message_fee",
      args: {},
    }).catch(() => "0");
    const transactions: Transaction[] = [
      {
        receiverId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: "send_transfer_near",
            args: {
              receiver: addressFormatEVM(receiver),
              chain: chainId,
              fee: "0",
              payload: "",
              message_fee,
            },
            amount,
            gas: "100000000000000",
          },
        ],
      },
    ];
    return executeMultipleTransactions(transactions, false);
  },
  async transferTokenFromNear({
    token,
    amount,
    receiver,
    targetChain,
  }: {
    token: BridgeModel.IBridgeTokenMeta;
    amount: string;
    receiver: string;
    targetChain: BridgeModel.BridgeSupportChain;
  }) {
    const assetId = token.address;
    const accountId = getAccountId();
    const nonAmount = toNonDivisibleNumber(token.decimals, amount || "0");
    const transactions: Transaction[] = [];
    const isWrapped = getIsWrappedAssetNear(
      WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
      assetId
    );
    const message_fee = await viewFunction({
      contractId: WORMHOLE_CORE_CONTRACT_ID,
      methodName: "message_fee",
      args: {},
    });
    const chainId = EVMConfig.chains[targetChain.toLocaleLowerCase()]
      .whChainId as ChainId;
    if (isWrapped) {
      transactions.push({
        receiverId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: "send_transfer_wormhole_token",
            args: {
              token: assetId,
              amount: nonAmount,
              receiver: addressFormatEVM(receiver),
              chain: chainId,
              fee: "0",
              payload: "",
              message_fee,
            },
            amount: Big(ONE_YOCTO_NEAR)
              .plus(message_fee || 0)
              .toFixed(),
            gas: "100000000000000",
          },
        ],
      });
    } else {
      const bal = await viewFunction({
        contractId: assetId,
        methodName: "storage_balance_of",
        args: {
          account_id: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
        },
      });
      if (bal === null) {
        // Looks like we have to stake some storage for this asset
        // for the token bridge...
        transactions.push({
          receiverId: assetId,
          functionCalls: [
            {
              methodName: "storage_deposit",
              args: {
                account_id: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
                registration_only: true,
              },
              amount: "0.002",
              gas: "100000000000000",
            },
          ],
        });
      }
      if (message_fee > 0) {
        const bank = await viewFunction({
          contractId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
          methodName: "bank_balance",
          args: {
            acct: accountId,
          },
        });

        if (!bank[0]) {
          transactions.push({
            receiverId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
            functionCalls: [
              {
                methodName: "register_bank",
                args: {},
                gas: "100000000000000",
                amount: "0.002",
              },
            ],
          });
        }

        if (bank[1] < message_fee) {
          transactions.push({
            receiverId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
            functionCalls: [
              {
                methodName: "fill_bank",
                args: {},
                gas: "100000000000000",
                amount: toReadableNumber(24, message_fee),
              },
            ],
          });
        }
      }
      transactions.push({
        receiverId: assetId,
        functionCalls: [
          {
            methodName: "ft_transfer_call",
            args: {
              receiver_id: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
              amount: nonAmount,
              msg: JSON.stringify({
                receiver: addressFormatEVM(receiver),
                chain: chainId,
                fee: "0",
                payload: "",
                message_fee,
              }),
            },
            amount: ONE_YOCTO_NEAR,
            gas: "100000000000000",
          },
        ],
      });
    }
    return executeMultipleTransactions(transactions, false);
  },
  async fetchSignedVAAOnNear({ receipt }: { receipt: FinalExecutionOutcome }) {
    const tokenBridge = WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID;
    const sequence = parseSequenceFromLogNear(receipt);
    const emitterAddress = getEmitterAddressNear(tokenBridge);
    const { vaaBytes, isPending } = await getSignedVAAWithRetry(
      CHAIN_ID_NEAR,
      emitterAddress,
      sequence
    );
    if (vaaBytes) {
      // Fetched Signed VAA
      const signedVaa = uint8ArrayToHex(vaaBytes);
      console.log("------------Fetched Signed VAA", signedVaa);
      return signedVaa;
    } else if (isPending) {
      // TODO 特殊场景需要处理
      // VAA is Pending
      console.log("------------VAA is Pending");
    } else {
      throw new Error("Error retrieving VAA info");
    }
  },
  async redeemOnNear({ vaa }: { vaa: string }) {
    const tokenBridge = WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID;
    const transactions: Transaction[] = [];
    const signedVAA: Uint8Array = hexToUint8Array(vaa);
    const accountId = getAccountId();
    const p = _parseVAAAlgorand(signedVAA);
    if (p.ToChain !== CHAIN_ID_NEAR) {
      throw new Error("Not destined for NEAR");
    }
    const user = await viewFunction({
      contractId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
      methodName: "hash_lookup",
      args: {
        hash: uint8ArrayToHex(p.ToAddress as Uint8Array),
      },
    });
    if (!user[0]) {
      transactions.push({
        receiverId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
        functionCalls: [
          {
            methodName: "register_account",
            args: { account: accountId },
            amount: "0.002",
            gas: "100000000000000",
          },
        ],
      });
    }
    const token = await getForeignAssetNear(
      WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
      p.FromChain as ChainId,
      p.Contract as string
    );
    if (!token) {
      throw new Error("Unregistered token (this been attested yet?)");
    }
    const receive_account_id = user[1] || accountId;
    if (
      p.Contract !==
      "0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      const bal = await viewFunction({
        contractId: token,
        methodName: "storage_balance_of",
        args: {
          account_id: receive_account_id,
        },
      });
      if (bal === null) {
        transactions.push({
          receiverId: token,
          functionCalls: [
            {
              methodName: "storage_deposit",
              args: { account_id: receive_account_id, registration_only: true },
              amount: "0.002",
              gas: "100000000000000",
            },
          ],
        });
      }
      if (
        p.Fee !== undefined &&
        Buffer.compare(
          p.Fee,
          Buffer.from(
            "0000000000000000000000000000000000000000000000000000000000000000",
            "hex"
          )
        ) !== 0
      ) {
        const bal = await viewFunction({
          contractId: token,
          methodName: "storage_balance_of",
          args: {
            account_id: accountId,
          },
        });
        if (bal === null) {
          console.log("Registering ", accountId, " for ", token);
          transactions.push({
            receiverId: token,
            functionCalls: [
              {
                methodName: "storage_deposit",
                args: { account_id: accountId, registration_only: true },
                amount: "0.002",
                gas: "100000000000000",
              },
            ],
          });
        }
      }
    }
    transactions.push({
      receiverId: tokenBridge,
      functionCalls: [
        {
          methodName: "submit_vaa",
          args: {
            vaa: uint8ArrayToHex(signedVAA),
          },
          amount: "0.1",
          gas: "150000000000000",
        },
      ],
    });
    transactions.push({
      receiverId: tokenBridge,
      functionCalls: [
        {
          methodName: "submit_vaa",
          args: {
            vaa: uint8ArrayToHex(signedVAA),
          },
          amount: "0.1",
          gas: "150000000000000",
        },
      ],
    });
    return executeMultipleTransactions(transactions, false);
  },
  async getAllowanceOnEth({
    tokenBridgeAddress,
    tokenAddress,
    signer,
  }: {
    tokenBridgeAddress: string;
    tokenAddress: string;
    signer: Signer;
  }) {
    const allowance = await getAllowanceEth(
      tokenBridgeAddress,
      tokenAddress,
      signer
    ).then(
      (result) => {
        return result.toBigInt();
      },
      (_error) => {
        // if (!cancelled) {
        //   setIsAllowanceFetching(false);
        //   //setError("Unable to retrieve allowance"); //TODO set an error
        // }
      }
    );
    return allowance;
  },
  async approveOnEth({
    fromChain,
    signer,
    amount,
    token,
  }: {
    fromChain: BridgeModel.BridgeSupportChain;
    signer: Signer;
    amount: string;
    token: BridgeModel.IBridgeTokenMeta;
  }) {
    const chainId = EVMConfig.chains[fromChain.toLocaleLowerCase()]
      .whChainId as ChainId;
    const tokenBridgeAddress = getTokenBridgeAddressForChain(chainId);
    const decimals = token.decimals;
    const tokenAddress = token.address;
    const transferAmountParsed = parseUnits(amount, decimals).toBigInt();
    const allowance = await wormholeBridgeService.getAllowanceOnEth({
      tokenBridgeAddress,
      tokenAddress,
      signer,
    });
    if (allowance && transferAmountParsed && allowance >= transferAmountParsed)
      return;
    return await approveEth(
      tokenBridgeAddress,
      tokenAddress,
      signer,
      BigNumber.from(transferAmountParsed),
      {}
    );
  },
  async transferOnEvm({
    isNative,
    fromChain,
    signer,
    amount,
    token,
  }: {
    isNative: boolean;
    fromChain: BridgeModel.BridgeSupportChain;
    signer: Signer;
    amount: string;
    token: BridgeModel.IBridgeTokenMeta;
  }) {
    const chainId = EVMConfig.chains[fromChain.toLocaleLowerCase()]
      .whChainId as ChainId;
    const tokenBridge = getTokenBridgeAddressForChain(chainId);
    const decimals = token.decimals;
    const tokenAddress = token.address;
    const nearAccountId = getAccountId();
    const account_hash = await viewFunction({
      contractId: WORMHOLE_TOKEN_BRIDGE_CONTRACT_ID,
      methodName: "hash_account",
      args: {
        account: nearAccountId,
      },
    });
    const recipientAddress = hexToUint8Array(account_hash[1]);
    const recipientChain = CHAIN_ID_NEAR;
    const baseAmountParsed = parseUnits(amount, decimals);
    const feeParsed = parseUnits("0", decimals);
    const transferAmountParsed = baseAmountParsed.add(feeParsed);
    const overrides = {};
    const payload = null;
    let receipt;
    if (isNative) {
      receipt = await transferFromEthNative(
        tokenBridge,
        signer,
        transferAmountParsed,
        recipientChain,
        recipientAddress,
        feeParsed,
        overrides,
        payload
      );
    } else {
      receipt = await transferFromEth(
        tokenBridge,
        signer,
        tokenAddress,
        transferAmountParsed,
        recipientChain,
        recipientAddress,
        feeParsed,
        overrides,
        payload
      );
    }
    return receipt;
  },
  async fetchSignedVAAOnEvm({
    receipt,
    fromChain,
  }: {
    receipt: ContractReceipt;
    fromChain: BridgeModel.BridgeSupportChain;
  }) {
    const chainId = EVMConfig.chains[fromChain.toLocaleLowerCase()]
      .whChainId as ChainId;
    const sequence = parseSequenceFromLogEth(
      receipt,
      getBridgeAddressForChain(chainId)
    );
    const emitterAddress = getEmitterAddressEth(
      getTokenBridgeAddressForChain(chainId)
    );
    const { vaaBytes, isPending } = await getSignedVAAWithRetry(
      chainId,
      emitterAddress,
      sequence
    );
    if (vaaBytes) {
      // Fetched Signed VAA
      const signedVaa = uint8ArrayToHex(vaaBytes);
      return signedVaa;
    } else if (isPending) {
      // VAA is Pending
    } else {
      throw new Error("Error retrieving VAA info");
    }
  },
  async redeemOnEvm({
    isNative,
    chainId,
    signer,
    signedVAAHex,
  }: {
    isNative: boolean;
    chainId: ChainId; // in wormhole chainId
    signer: Signer;
    signedVAAHex: string;
  }) {
    const signedVAA = hexToUint8Array(signedVAAHex);
    const overrides = {};
    const receipt = isNative
      ? await redeemOnEthNative(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA,
          overrides
        )
      : await redeemOnEth(
          getTokenBridgeAddressForChain(chainId),
          signer,
          signedVAA,
          overrides
        );
    console.log("-----------------receipt", receipt);
    return receipt;
    // setRedeemTx({ id: receipt.transactionHash, block: receipt.blockNumber })
  },
  async getVaaByTxIdOnNear({ txId }: { txId: string }) {},
  async getVaaByTxIdOnEvm({ txId }: { txId: string }) {},
  // deprecated
  async redeemOnNearChain({
    accountId,
    vaa,
  }: {
    accountId: string;
    vaa: string;
  }) {
    // near-api-js version issue
    const near = await getNear();
    const provider = near.connection.provider;
    const tokenBridgeAddress = getTokenBridgeAddressForChain(CHAIN_ID_NEAR);
    const signedVAA: Uint8Array = hexToUint8Array(vaa);
    // redeemOnNear(provider, accountId, tokenBridgeAddress, signedVAA)
    // provider: Provider, account: string, tokenBridge: string, vaa: Uint8Array
  },
};

export default wormholeBridgeService;
