import { NextApiRequest, NextApiResponse } from "next";
import { addLink } from "@/lib/api/links";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { Keypair } from "@solana/web3.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  // GET /api/links – get all dub.sh links created by the user
  if (req.method === "GET") {
    const { status, sort } = req.query as {
      status?: string;
      sort?: "createdAt" | "clicks";
    };
    const response = await prisma.link.findMany({
      where: {
        userId: (session.user as any).id as string,
      },
      orderBy: {
        [sort || "createdAt"]: "desc",
      },
      take: 100,
    });
    return res.status(200).json(response);

    // POST /api/links – create a new link
  } else if (req.method === "POST") {
    const response = await addLink({
      ...req.body,
      reference: new Keypair().publicKey.toBase58(),
      userId: (session.user as any).id as string,
    });

    if (response === null) {
      return res.status(403).json({ error: "Key already exists" });
    }
    return res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
