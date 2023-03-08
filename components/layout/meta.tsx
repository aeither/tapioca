import Head from "next/head";

const DOMAIN = "https://precedent.dev";

export default function Meta({
  title = "Precedent - Building blocks for your Next.js project",
  description = "Precedent is the all-in-one solution for your Next.js project. It includes a design system, authentication, analytics, and more.",
  image = `${DOMAIN}/api/og`,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
