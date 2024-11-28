import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";

import BridgePreviewModal from "@/components/bridge/BridgePreview";
import useBridgeForm from "@/hooks/useBridgeForm";
import { useWormholePersistStore } from "@/stores/wormhole";

const BridgeWormholeModal = dynamic(
  () => import("../components/bridge/WormholeModal"),
  {
    ssr: false,
  }
);

type Props = ReturnType<typeof useBridgeForm> & {
  openPreviewModal: () => void;
  openWormholeModal: () => void;
};

const BridgeFormContext = createContext<Props>(null);

export function useBridgeFormContext() {
  return useContext(BridgeFormContext);
}

export default function BridgeFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fromAccountAddress, toAccountAddress, ...restHooks } =
    useBridgeForm();

  const canPreview = useMemo(
    () => fromAccountAddress && toAccountAddress,
    [fromAccountAddress, toAccountAddress]
  );

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [wormholeModalOpen, setWormholeModalOpen] = useState(false);
  const { setRedeem, setTransfer, setFetchSignedVaa } =
    useWormholePersistStore();
  function toggleOpen() {
    setPreviewModalOpen(!previewModalOpen);
  }
  function toggleWormholeOpen() {
    setWormholeModalOpen(!wormholeModalOpen);
  }
  function openPreviewModal() {
    setPreviewModalOpen(true);
  }
  function openWormholeModal() {
    const initState = {
      status: "unDone",
      result: null,
    } as BridgeModel.IWormholeStepData;
    setTransfer(initState);
    setFetchSignedVaa(initState);
    setRedeem(initState);
    setWormholeModalOpen(true);
  }

  const exposes = {
    ...restHooks,
    fromAccountAddress,
    toAccountAddress,
    openPreviewModal,
    openWormholeModal,
  };

  return (
    <BridgeFormContext.Provider value={exposes}>
      {children}
      {canPreview && (
        <BridgePreviewModal
          isOpen={previewModalOpen}
          toggleOpenModal={toggleOpen}
        />
      )}
      <BridgeWormholeModal
        isOpen={wormholeModalOpen}
        toggleOpenModal={toggleWormholeOpen}
      />
    </BridgeFormContext.Provider>
  );
}
