import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FindReferenceError, findReference } from '@solana/pay'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Keypair, Transaction } from '@solana/web3.js'

import {
  MakeTransactionInputData,
  MakeTransactionOutputData,
} from '@/pages/api/makeTransaction'

export default function Cart() {
  const router = useRouter()
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  // State to hold API response fields
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Read the URL query (which includes our chosen products)
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(router.query)) {
    if (value) {
      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(key, v)
        }
      } else {
        searchParams.append(key, value)
      }
    }
  }

  // Generate the unique reference which will be used for this transaction
  const reference = useMemo(() => Keypair.generate().publicKey, [])

  // Add it to the params we'll pass to the API
  searchParams.append('reference', reference.toString())

  // Use our API to fetch the transaction for the selected items
  async function getTransaction() {
    if (!publicKey) {
      return
    }

    const body: MakeTransactionInputData = {
      account: publicKey.toString(),
    }

    const response = await fetch(`/api/makeTransaction?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const json = (await response.json()) as MakeTransactionOutputData

    if (response.status !== 200) {
      console.error(json)
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
  }, [publicKey])

  // Send the fetched transaction to the connected wallet
  async function trySendTransaction() {
    if (!transaction) {
      return
    }
    try {
      const tx = await sendTransaction(transaction, connection)
      console.log('reference =>', reference)
      console.log('tx =>', tx)
    } catch (e) {
      console.error(e)
    }
  }

  // Send the transaction once it's fetched
  //   useEffect(() => {
  //     trySendTransaction();
  //   }, [transaction]);

  // Check every 0.5s if the transaction is completed
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, reference)
        console.log('They paid!!!')
      } catch (e) {
        if (e instanceof FindReferenceError) {
          // No transaction found yet, ignore this error
          return
        }
        console.error('Unknown error', e)
      }
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div>
          <Link href={'/'}>Cancel</Link>
        </div>

        <WalletMultiButton />

        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <Link href={'/'}>Cancel</Link>
      </div>

      <button
        onClick={() => trySendTransaction()}
        style={{ backgroundColor: 'blue' }}
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
  )
}
