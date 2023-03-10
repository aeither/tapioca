import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prisma'

export type MakeTransactionInputData = {
  account: string
}

export type MakeTransactionOutputData = {
  transaction: string
  message: string
}

type ErrorOutput = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>,
) {
  if (req.method === 'GET') {
    const { reference, payer } = req.query as {
      reference?: string
      payer?: string
    }
    const link = await prisma.order.findUnique({
      where: {
        reference,
      },
    })

    if (!reference) return res.status(400).json({ error: 'reference not found' })
    if (!payer) {
      res.status(400).json({ error: 'No account provided' })
      return
    }
    if (!link) return res.status(400).json({ error: 'link not found' })

    try {
      const { amount, shopAddress } = link

      const buyerPublicKey = new PublicKey(payer)
      const shopPublicKey = new PublicKey(shopAddress)

      const network = WalletAdapterNetwork.Devnet
      const endpoint = clusterApiUrl(network)
      const connection = new Connection(endpoint)

      // Get a recent blockhash to include in the transaction
      const { blockhash } = await connection.getLatestBlockhash('finalized')

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        // The buyer pays the transaction fee
        feePayer: buyerPublicKey,
      })

      // Create the instruction to send SOL from the buyer to the shop
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: buyerPublicKey,
        lamports: new BigNumber(amount).multipliedBy(LAMPORTS_PER_SOL).toNumber(),
        toPubkey: shopPublicKey,
      })

      // Add the reference to the instruction as a key
      // This will mean this transaction is returned when we query for the reference
      transferInstruction.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      })

      // Add the instruction to the transaction
      transaction.add(transferInstruction)

      // Serialize the transaction and convert to base64 to return it
      const serializedTransaction = transaction.serialize({
        // We will need the buyer to sign this transaction after it's returned to them
        requireAllSignatures: false,
      })
      const base64 = serializedTransaction.toString('base64')

      // Insert into database: reference, amount

      // Return the serialized transaction
      res.status(200).json({
        transaction: base64,
        message: 'Thanks for your order! 🍪',
      })
    } catch (err) {
      console.error(err)

      res.status(500).json({ error: 'error creating transaction' })
      return
    }
  }
}
