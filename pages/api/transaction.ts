// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { shopAddress } from '@/libs/constants/constants'
import { prisma } from '@/server/db'
import {
  Cluster,
  clusterApiUrl,
  Connection, LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'

type GetResponse = {
  label: string
  icon: string
}

export type PostRequest = {
  account: string
}

export type PostResponse = {
  transaction: string
  message: string
  network: Cluster
}

export type PostError = {
  error: string
}

// Response for GET request
function get(res: NextApiResponse<GetResponse>) {
  res.status(200).json({
    label: 'Solana Burgers',
    icon: 'https://solanapay.com/src/img/branding/Solanapay.com/downloads/gradient.svg',
  })
}

// Main body of the POST request, this returns the transaction
async function postImpl(
  network: Cluster,
  account: PublicKey,
  reference: PublicKey,
  order: string,
): Promise<PostResponse> {
  // Can also use a custom RPC here
  const endpoint = clusterApiUrl(network)
  const connection = new Connection(endpoint)

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

  // Create any transaction
  const transaction = new Transaction({
    feePayer: account,
    blockhash,
    lastValidBlockHeight,
  })

  // update to db
  const productsTotal = await prisma.product.aggregate({
    where: {
      orderId: {
        equals: order,
      },
    },
    _sum: {
      price: true,
    },
  })

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: account,
    toPubkey: shopAddress, // Restaurant address
    lamports: ((productsTotal._sum.price || 1) * LAMPORTS_PER_SOL) / 20, // convert
  })

  // Add reference as a key to the instruction
  // This allows us to listen for this transaction
  transferInstruction.keys.push({
    pubkey: reference,
    isSigner: false,
    isWritable: false,
  })

  transaction.add(transferInstruction)

  // Serialize the transaction and convert to base64 to return it
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false, // account is a missing signature
  })
  const base64 = serializedTransaction.toString('base64')

  // Return the serialized transaction
  return {
    transaction: base64,
    message: 'Complete your payment. Your order will be ready shortly.',
    network,
  }
}

// We pass eg. network in query params, this function extracts the value of a query param
function getFromQuery(req: NextApiRequest, field: string): string | undefined {
  if (!(field in req.query)) return undefined

  const value = req.query[field]
  if (typeof value === 'string') return value
  // value is string[]
  if (value && value.length === 0) return undefined
  return value && value[0]
}

async function post(req: NextApiRequest, res: NextApiResponse<PostResponse | PostError>) {
  const { account } = req.body as PostRequest
  console.log(req.body)
  if (!account) {
    res.status(400).json({ error: 'No account provided' })
    return
  }

  const network = getFromQuery(req, 'network') as Cluster
  if (!network) {
    res.status(400).json({ error: 'No network provided' })
    return
  }

  const reference = getFromQuery(req, 'reference')
  if (!reference) {
    res.status(400).json({ error: 'No reference provided' })
    return
  }

  const order = getFromQuery(req, 'order')
  if (!order) {
    res.status(400).json({ error: 'No order provided' })
    return
  }

  // update to db
  await prisma.order.update({
    where: {
      reference,
    },
    data: {
      customerAddress: account,
    },
  })

  try {
    const postResponse = await postImpl(
      network,
      new PublicKey(account),
      new PublicKey(reference),
      order,
    )
    res.status(200).json(postResponse)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creating transaction' })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | PostError>,
) {
  if (req.method === 'GET') {
    return get(res)
  } else if (req.method === 'POST') {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
