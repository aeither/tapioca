import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "GET") {
    const { status, sort } = req.query as {
      status?: string;
      sort?: "createdAt" | "clicks";
    };
    const response = await prisma.product.findMany({
      where: {
        userId: (session.user as any).id as string,
      },
      orderBy: {
        [sort || "createdAt"]: "desc",
      },
      take: 100,
    });
    return res.status(200).json(response);
  } else if (req.method === "POST") {
    const { price, description, title } = req.body;

    if (
      typeof description !== "string" ||
      typeof title !== "string" ||
      typeof price !== "number"
    )
      return res
        .status(400)
        .json({ error: "Query description, title or price error" });

    const response = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: Number(price),
        userId: (session.user as any).id as string,
      },
    });

    if (response === null) {
      return res.status(403).json({ error: "Key already exists" });
    }
    return res.status(200).json(response);

    // PATCH
  } else if (req.method === "PATCH") {
    const { id, price, description, title } = req.body;

    if (
      typeof id !== "string" ||
      typeof description !== "string" ||
      typeof title !== "string" ||
      typeof price !== "number"
    )
      return res
        .status(400)
        .json({ error: "Query id, description, title or price error" });

    const response = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        price: Number(price),
      },
    });

    if (response === null) {
      return res.status(403).json({ error: "Key already exists" });
    }
    return res.status(200).json(response);
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    const response = await prisma.product.delete({
      where: {
        id: id,
      },
    });

    if (response === null) {
      return res.status(403).json({ error: "Key already exists" });
    }
    return res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
