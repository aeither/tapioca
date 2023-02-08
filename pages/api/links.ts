import { NextApiRequest, NextApiResponse } from "next";
import { addLink } from "@/lib/api/links";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { Keypair } from "@solana/web3.js";
import { PaymentStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

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

    // PATCH /api/links – update a new link
  } else if (req.method === "PATCH") {
    const { reference } = req.query as {
      reference?: string;
    };
    const { status } = req.body as {
      status?: PaymentStatus;
    };

    if (reference === undefined) {
      return res.status(400).json({ error: "Reference not found in query" });
    }

    const response = await prisma.link.update({
      where: {
        reference: String(reference),
      },
      data: {
        status: status,
      },
    });
    console.log("🚀 ~ file: links.ts:74 ~ response", response);

    if (response === null) {
      return res.status(403).json({ error: "Key already exists" });
    }
    return res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
