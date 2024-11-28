import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type IWormholePersistState = {
  transfer: BridgeModel.IWormholeStepData;
  fetchSignedVaa: BridgeModel.IWormholeStepData;
  redeem: BridgeModel.IWormholeStepData;
  setTransfer: (transfer: BridgeModel.IWormholeStepData) => void;
  setFetchSignedVaa: (fetchSignedVaa: BridgeModel.IWormholeStepData) => void;
  setRedeem: (redeem: BridgeModel.IWormholeStepData) => void;
};
type PersistWormholeStore = StateCreator<
  IWormholePersistState,
  [],
  [],
  IWormholePersistState
>;
export const useWormholePersistStore = create<IWormholePersistState>()(
  persist(
    ((set, get: any) => ({
      transfer: {
        status: "unDone",
        result: null,
      },
      fetchSignedVaa: {
        status: "unDone",
        result: null,
      },
      redeem: {
        status: "unDone",
        result: null,
      },
      setTransfer: (transfer: BridgeModel.IWormholeStepData) =>
        set({ transfer }),
      setFetchSignedVaa: (fetchSignedVaa: BridgeModel.IWormholeStepData) =>
        set({ fetchSignedVaa }),
      setRedeem: (redeem: BridgeModel.IWormholeStepData) => set({ redeem }),
    })) as PersistWormholeStore,
    {
      name: "_cached_wormhole_transfer",
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
