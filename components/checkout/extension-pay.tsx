import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

import useMakeTx from "@/lib/hooks/use-maketx";
import { PublicKey } from "@solana/web3.js";

export default function ExtensionPay({ reference }: { reference: string }) {
  const { publicKey } = useWallet();
  const { message, transaction, trySendTransaction } = useMakeTx({ reference });

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div>
          <Link href={"/"}>Cancel</Link>
        </div>

        <WalletMultiButton />

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
        style={{ backgroundColor: "blue" }}
        disabled={!transaction}
      >
        Pay
      </button>

      {message ? (
        <p>{message} Please approve the transaction using your wallet</p>
      ) : (
        <p>Creating transaction...</p>
      )}
    </div>
  );
}
