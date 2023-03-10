import { findReference } from '@solana/pay'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import { MakeTransactionOutputData } from '@/pages/api/makeTx'
import { PaymentStatus } from '@prisma/client'

export default function useMakeTx({ reference }: { reference: string | undefined }) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // State to indicate already paid
  const [hasPaid, setHasPaid] = useState(false)

  // Use our API to fetch the transaction for the selected items
  async function getTransaction() {
    if (!publicKey || !reference) {
      return
    }

    const json: MakeTransactionOutputData = await fetch(
      `/api/makeTx?reference=${reference}&payer=${publicKey.toBase58()}`,
    ).then((res) => res.json())

    if (!json.transaction) {
      console.log('No json.transaction from /api/makeTx?reference=${reference}', json)
      return
    }

    // Deserialize the transaction from the response
    const transaction = Transaction.from(Buffer.from(json.transaction, 'base64'))
    setTransaction(transaction)
    setMessage(json.message)
    console.log(transaction)
  }
  useEffect(() => {
    getTransaction()
  }, [publicKey, reference])

  // Send the fetched transaction to the connected wallet
  async function trySendTransaction() {
    if (!transaction) {
      return
    }
    try {
      const tx = await sendTransaction(transaction, connection)

      const result = await connection.getSignatureStatus(tx)
      const res = await fetch(`/api/links?reference=${reference}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: PaymentStatus.SUCCEEDED,
          payer: publicKey?.toBase58(),
        }),
      }).then((res) => res.json())

      console.log('reference =>', reference)
      console.log('tx =>', tx)
      console.log('status =>', result.value?.confirmationStatus)
    } catch (e) {
      console.error(e)
    }
  }

  const _reference = useMemo(() => {
    if (reference) return new PublicKey(reference)
  }, [reference])
  const { data: sig } = useSWR(
    [`check is completed`, _reference],
    async ([key, _reference]) => {
      if (!_reference) return
      const signatureInfo = await findReference(connection, _reference)
      setHasPaid(true)
      return signatureInfo
    },
    { refreshInterval: 2000 },
  )
  console.log('🚀 ~ file: use-maketx.ts:84 ~ sig', sig)

  return {
    trySendTransaction,
    transaction,
    message,
    hasPaid,
  }
}
