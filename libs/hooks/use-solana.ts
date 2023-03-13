import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { TipLink } from '@tiplink/api'
import { toast } from 'sonner'

const TIPLINK_MINIMUM_LAMPORTS = 4083560

export const useSolana = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const createGiftCard = async (amount: number) => {
    const lambortAmount = LAMPORTS_PER_SOL * amount

    if (!publicKey) {
      return undefined
    }

    const tiplink = await TipLink.create()
    console.log('link: ', tiplink.url.toString())
    console.log('publicKey: ', tiplink.keypair.publicKey.toBase58())

    const isValidAddress = await PublicKey.isOnCurve(tiplink.keypair.publicKey)
    if (!isValidAddress) {
      throw 'Invalid TipLink'
    }

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext()

    let transaction = new Transaction()
    let signature: TransactionSignature | undefined = undefined

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: tiplink.keypair.publicKey,
        lamports: lambortAmount,
      }),
    )

    signature = await sendTransaction(transaction, connection, { minContextSlot })
    await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
    toast(`success`)

    return tiplink
  }

  return {
    createGiftCard,
  }
}
