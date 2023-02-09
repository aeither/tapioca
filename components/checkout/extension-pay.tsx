import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";

import useMakeTx from "@/lib/hooks/use-maketx";
import { ConnectWallet } from "../home/wallet";
import { useSuccessModal } from "@/components/home/success-modal";
import { useEffect } from "react";

export default function ExtensionPay({ reference }: { reference: string }) {
  const { publicKey } = useWallet();
  const { message, transaction, trySendTransaction, hasPaid } = useMakeTx({
    reference,
  });
  const { Modal: SucessModal, setShowModal: setShowSuccessModal } =
    useSuccessModal();

  useEffect(() => {
    hasPaid && setShowSuccessModal(true);
  }, [hasPaid]);

  if (hasPaid) {
    return (
      <>
        <SucessModal />
        <p>Have been paid successfully</p>;
      </>
    );
  }

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div>
          <Link href={"/"}>Cancel</Link>
        </div>

        <ConnectWallet />
        <p>You need to connect your wallet to make transactions</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <Link href={"/"}>Cancel</Link>
      </div>

      <button
        onClick={() => trySendTransaction()}
        className="rounded border border-slate-400 bg-slate-200 px-4 py-2"
        disabled={!transaction}
      >
        Pay now
      </button>

      {message ? (
        <p>{message} Please approve the transaction using your wallet</p>
      ) : (
        <p>Creating transaction...</p>
      )}
    </div>
  );
}
