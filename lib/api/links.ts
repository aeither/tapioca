import prisma from "@/lib/prisma";

export async function checkIfKeyExists(reference: string) {
  const link = await prisma.link.findUnique({
    where: {
      reference,
    },
  });
  return !!link;
}

export async function addLink(link: any) {
  const { expiresAt, title, description, amount, reference } = link;

  // add qstash update on expiry
  const exat = expiresAt ? new Date(expiresAt).getTime() / 1000 : null;

  const exists = await checkIfKeyExists(reference);
  if (exists) return null;

  let [response] = await Promise.all([
    prisma.link.create({
      data: {
        ...link,
        title: title,
        description: description,
        reference,
        amount,
      },
    }),
  ]);
  return response;
}
