import { findReference, FindReferenceError } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useEffect, useState } from "react";

import {
  MakeTransactionInputData,
  MakeTransactionOutputData,
} from "@/pages/api/makeTransaction";
import { PaymentStatus } from "@prisma/client";

export default function useMakeTx({
  reference,
}: {
  reference: string | undefined;
}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // State to indicate already paid
  const [hasPaid, setHasPaid] = useState(false);

  // Use our API to fetch the transaction for the selected items
  async function getTransaction() {
    if (!publicKey || !reference) {
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

    // // Refresh Tx to include latest block
    // const interval = setInterval(async () => {
    //   getTransaction();
    // }, 5000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [publicKey, reference]);

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
          new PublicKey(reference || ""),
        );

        setHasPaid(true);
        clearInterval(interval);

        // update payment status
        const res = await fetch(`/api/links?reference=${reference}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: PaymentStatus.SUCCEEDED,
          }),
        }).then((res) => res.json());
        console.log("They paid!!!", signatureInfo);
        console.log("Update!!!", res);
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
    hasPaid,
  };
}
