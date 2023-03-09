import { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@/libs/prisma'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' })
    return
  }

  if (req.method === 'GET') {
    const { reference } = req.query as {
      reference?: string
    }
    const response = await prisma.link.findFirst({
      where: {
        reference: reference,
      },
    })
    return res.status(200).json(response)

    // other
  } else {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}
