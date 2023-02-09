import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useRive } from "@rive-app/react-canvas";

const SucessModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { RiveComponent, rive } = useRive({
    src: "/assets/success.riv",
    autoplay: true,
  });

  useEffect(() => {
    if (showModal) {
      console.log("showmodal");
      setTimeout(() => setShowModal(false), 2300);
    } else {
      console.log("else");
    }
  }, [showModal]);

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="https://precedent.dev"></a>
          <h3 className="font-display text-2xl font-bold">Rive</h3>
          <div className="h-96 w-96">
            <RiveComponent />
          </div>
          <p className="text-sm text-gray-500">
            Precedent is an opinionated collection of components, hooks, and
            utilities for your Next.js project.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export function useSuccessModal() {
  const [showModal, setShowModal] = useState(false);

  const ModalCallback = useCallback(() => {
    return <SucessModal showModal={showModal} setShowModal={setShowModal} />;
  }, [showModal, setShowModal]);

  return useMemo(
    () => ({ setShowModal, Modal: ModalCallback }),
    [setShowModal, ModalCallback],
  );
}
