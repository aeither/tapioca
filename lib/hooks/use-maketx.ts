import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";

import {
  MakeTransactionInputData,
  MakeTransactionOutputData,
} from "@/pages/api/makeTransaction";

export default function useMakeTx({ reference }: { reference: string }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // State to indicate already paid
  const [hasSignature, setHasSignature] = useState(false);

  // Use our API to fetch the transaction for the selected items
  async function getTransaction() {
    if (!publicKey) {
      return;
    }

    const json: MakeTransactionOutputData = await fetch(
      `/api/makeTx?reference=${reference}&payer=${publicKey.toBase58()}`,
    ).then((res) => res.json());

    if (!json.transaction) {
      console.log(
        "No json.transaction from /api/makeTx?reference=${reference}",
        json,
      );
      return;
    }

    // Deserialize the transaction from the response
    const transaction = Transaction.from(
      Buffer.from(json.transaction, "base64"),
    );
    setTransaction(transaction);
    setMessage(json.message);
    console.log(transaction);
  }
  useEffect(() => {
    getTransaction();
  }, [publicKey]);

  // Send the fetched transaction to the connected wallet
  async function trySendTransaction() {
    if (!transaction) {
      return;
    }
    try {
      const tx = await sendTransaction(transaction, connection);
      console.log("reference =>", reference);
      console.log("tx =>", tx);
    } catch (e) {
      console.error(e);
    }
  }

  // Check every 0.5s if the transaction is completed
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(
          connection,
          new PublicKey(reference),
        );

        // setHasSignature(signatureInfo)
        console.log("They paid!!!", signatureInfo);
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return;
        }
        console.error("Unknown error", e);
      }
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    trySendTransaction,
    transaction,
    message,
  };
}
