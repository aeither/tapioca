import { PublicKey } from '@solana/web3.js'
import { useEffect, useRef } from 'react'
import { findReference, FindReferenceError } from '@solana/pay'
import { useConnection } from '@solana/wallet-adapter-react'
import { useDB } from './use-db'
import { toast } from 'sonner'
import { useRouter } from 'next/router'
import { useStore } from '../store'
import { PaymentStatus } from '@prisma/client'

export default function useTransactionListener({
  reference,
}: {
  reference: string | null | undefined
}) {
  const orderId = useStore((state) => state.orderId)
  const { connection } = useConnection()
  const { updateOrder } = useDB()
  const { replace } = useRouter()
  const mostRecentNotifiedTransaction = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!reference || !orderId) return

    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        const signatureInfo = await findReference(connection, new PublicKey(reference), {
          until: mostRecentNotifiedTransaction.current,
        })

        console.log('Transaction confirmed', signatureInfo)
        mostRecentNotifiedTransaction.current = signatureInfo.signature
        updateOrder.mutate({
          orderId,
          status: PaymentStatus.SUCCEEDED,
        })
        toast('Transaction confirmed')
        replace('/')
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
  }, [connection, reference])
}
